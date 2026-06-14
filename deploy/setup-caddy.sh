#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CADDYFILE_SRC="${SCRIPT_DIR}/Caddyfile"
CADDYFILE_DEST="/etc/caddy/Caddyfile"

if [[ "${EUID}" -ne 0 ]]; then
	echo "Run as root: sudo ${SCRIPT_DIR}/setup-caddy.sh" >&2
	exit 1
fi

if ! command -v apt-get >/dev/null 2>&1; then
	echo "This script supports Ubuntu/Debian (apt) only." >&2
	exit 1
fi

if [[ ! -f "${CADDYFILE_SRC}" ]]; then
	echo "Missing Caddyfile at ${CADDYFILE_SRC}" >&2
	exit 1
fi

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

install_caddy

echo "Installing Caddyfile..."
install -m 644 "${CADDYFILE_SRC}" "${CADDYFILE_DEST}"

echo "Validating configuration..."
caddy validate --config "${CADDYFILE_DEST}"

echo "Enabling and starting Caddy..."
systemctl enable caddy
systemctl restart caddy

echo
echo "Caddy is running."
systemctl --no-pager status caddy
echo
echo "Ensure DNS points moneyfi.metzark.com to this host and Next.js is listening on localhost:3000."
echo "Test: curl -I https://moneyfi.metzark.com"
