#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
NEXT_DIR="${REPO_ROOT}/next"
ENV_FILE="${NEXT_DIR}/.env.local"
CADDYFILE_SRC="${SCRIPT_DIR}/Caddyfile"
CADDYFILE_DEST="/etc/caddy/Caddyfile"
PM2_APP_NAME="moneyfi"
ECOSYSTEM_FILE="${SCRIPT_DIR}/ecosystem.config.cjs"

if [[ "${EUID}" -ne 0 ]]; then
	echo "Run as: sudo ./deploy/setup.sh" >&2
	exit 1
fi

if [[ -z "${SUDO_USER:-}" ]]; then
	echo "Run via sudo from your login user (e.g. ubuntu), not from a root shell." >&2
	exit 1
fi

if ! command -v apt-get >/dev/null 2>&1; then
	echo "This script supports Ubuntu/Debian (apt) only." >&2
	exit 1
fi

if [[ ! -f "${NEXT_DIR}/package.json" ]]; then
	echo "Missing Next.js app at ${NEXT_DIR}. Clone the repo first." >&2
	exit 1
fi

if [[ ! -f "${CADDYFILE_SRC}" ]]; then
	echo "Missing Caddyfile at ${CADDYFILE_SRC}" >&2
	exit 1
fi

DEPLOY_USER="${SUDO_USER}"
DEPLOY_HOME="$(getent passwd "${DEPLOY_USER}" | cut -d: -f6)"
DEPLOY_GROUP="$(id -gn "${DEPLOY_USER}")"

run_as_deploy() {
	sudo -u "${DEPLOY_USER}" -H env HOME="${DEPLOY_HOME}" PATH="${PATH}" "$@"
}

escape_env_value() {
	local value="$1"
	value="${value//\'/\'\\\'\'}"
	printf '%s' "${value}"
}

read_env_var() {
	local var_name="$1"
	local label="$2"
	local default="${3:-}"
	local secret="${4:-0}"
	local current=""
	local input=""

	if [[ -f "${ENV_FILE}" ]]; then
		current="$(grep -E "^${var_name}=" "${ENV_FILE}" 2>/dev/null | head -n1 | cut -d= -f2- | sed "s/^['\"]//; s/['\"]$//" || true)"
	fi

	local placeholder="${current:-$default}"

	if [[ "${secret}" == "1" ]]; then
		if [[ -n "${current}" ]]; then
			read -rsp "${label} [hidden, Enter to keep current]: " input
			echo
		else
			read -rsp "${label}: " input
			echo
		fi
	else
		read -rp "${label} [${placeholder}]: " input
	fi

	if [[ -z "${input}" ]]; then
		input="${placeholder}"
	fi

	if [[ -z "${input}" && "${secret}" == "1" ]]; then
		echo "${label} is required." >&2
		exit 1
	fi

	printf -v "${var_name}" '%s' "${input}"
}

install_node() {
	if command -v node >/dev/null 2>&1; then
		echo "Node.js is already installed: $(node --version)"
		return
	fi

	echo "Installing Node.js 22..."
	apt-get update
	apt-get install -y ca-certificates curl gnupg
	curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
	apt-get install -y nodejs
	echo "Installed Node.js: $(node --version)"
}

install_pm2() {
	if command -v pm2 >/dev/null 2>&1; then
		echo "PM2 is already installed: $(pm2 --version)"
		return
	fi

	echo "Installing PM2..."
	npm install -g pm2
}

install_caddy() {
	if command -v caddy >/dev/null 2>&1; then
		echo "Caddy is already installed: $(caddy version)"
		return
	fi

	echo "Installing Caddy..."
	apt-get update
	apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl gnupg

	curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
		| gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg

	curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
		| tee /etc/apt/sources.list.d/caddy-stable.list

	apt-get update
	apt-get install -y caddy
}

write_env_file() {
	local nhost_region="$1"
	local nhost_subdomain="$2"
	local openai_api_key="$3"
	local elevenlabs_api_url="$4"
	local elevenlabs_api_key="$5"

	cat >"${ENV_FILE}" <<EOF
NHOST_REGION='$(escape_env_value "${nhost_region}")'
NHOST_SUBDOMAIN='$(escape_env_value "${nhost_subdomain}")'
NEXT_PUBLIC_NHOST_REGION='$(escape_env_value "${nhost_region}")'
NEXT_PUBLIC_NHOST_SUBDOMAIN='$(escape_env_value "${nhost_subdomain}")'
OPENAI_API_KEY='$(escape_env_value "${openai_api_key}")'
ELEVENLABS_API_URL='$(escape_env_value "${elevenlabs_api_url}")'
ELEVENLABS_API_KEY='$(escape_env_value "${elevenlabs_api_key}")'
EOF

	chown "${DEPLOY_USER}:${DEPLOY_GROUP}" "${ENV_FILE}"
	chmod 600 "${ENV_FILE}"
	echo "Wrote ${ENV_FILE}"
}

write_pm2_ecosystem() {
	cat >"${ECOSYSTEM_FILE}" <<EOF
module.exports = {
  apps: [
    {
      name: "${PM2_APP_NAME}",
      cwd: "${NEXT_DIR}",
      script: "node_modules/.bin/next",
      args: "start",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
EOF

	chown "${DEPLOY_USER}:${DEPLOY_GROUP}" "${ECOSYSTEM_FILE}"
}

build_and_start_app() {
	echo "Installing dependencies..."
	run_as_deploy npm ci --prefix "${NEXT_DIR}"

	echo "Building Next.js..."
	run_as_deploy npm run build --prefix "${NEXT_DIR}"

	echo "Starting app with PM2..."
	if run_as_deploy pm2 describe "${PM2_APP_NAME}" >/dev/null 2>&1; then
		run_as_deploy pm2 restart "${ECOSYSTEM_FILE}" --update-env
	else
		run_as_deploy pm2 start "${ECOSYSTEM_FILE}"
	fi

	run_as_deploy pm2 save

	if ! systemctl is-enabled "pm2-${DEPLOY_USER}" >/dev/null 2>&1; then
		echo "Configuring PM2 to start on boot..."
		local startup_cmd
		startup_cmd="$(run_as_deploy pm2 startup systemd -u "${DEPLOY_USER}" --hp "${DEPLOY_HOME}" | grep '^sudo env' || true)"
		if [[ -n "${startup_cmd}" ]]; then
			eval "${startup_cmd}"
		fi
		run_as_deploy pm2 save
	fi
}

setup_caddy() {
	echo "Installing Caddyfile..."
	install -m 644 "${CADDYFILE_SRC}" "${CADDYFILE_DEST}"

	echo "Validating Caddy configuration..."
	caddy validate --config "${CADDYFILE_DEST}"

	echo "Enabling and starting Caddy..."
	systemctl enable caddy
	systemctl restart caddy
}

echo "=== MoneyFi server setup ==="
echo "Repo: ${REPO_ROOT}"
echo "Deploy user: ${DEPLOY_USER}"
echo

echo "--- Environment variables ---"
echo "Press Enter to keep an existing value."
echo

read_env_var NHOST_REGION "Nhost region" "us-east-1"
read_env_var NHOST_SUBDOMAIN "Nhost subdomain"
read_env_var OPENAI_API_KEY "OpenAI API key" "" 1
read_env_var ELEVENLABS_API_URL "ElevenLabs API URL" "https://api.us.elevenlabs.io/v1"
read_env_var ELEVENLABS_API_KEY "ElevenLabs API key" "" 1

if [[ -z "${NHOST_SUBDOMAIN}" ]]; then
	echo "Nhost subdomain is required." >&2
	exit 1
fi

echo
echo "--- Installing dependencies ---"
install_node
install_pm2
install_caddy

echo
echo "--- Configuring app ---"
write_env_file \
	"${NHOST_REGION}" \
	"${NHOST_SUBDOMAIN}" \
	"${OPENAI_API_KEY}" \
	"${ELEVENLABS_API_URL}" \
	"${ELEVENLABS_API_KEY}"
write_pm2_ecosystem
build_and_start_app

echo
echo "--- Configuring reverse proxy ---"
setup_caddy

echo
echo "=== Setup complete ==="
echo
run_as_deploy pm2 status
echo
systemctl --no-pager status caddy
echo
echo "Site: https://moneyfi.metzark.com"
echo "Logs: pm2 logs ${PM2_APP_NAME}"
echo "      sudo journalctl -u caddy -f"
