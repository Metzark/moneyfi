# MoneyFi

An AI financial advising service powered by Next.js, Nhost, OpenAI, and ElevenLabs.

## Project Structure

- `nhost/` — Backend (Postgres, Auth, Hasura GraphQL) and database migrations
- `next/` — Next.js frontend
- `deploy/` — Production reverse-proxy config and setup scripts

## Development

### Requirements

- [Docker](https://www.docker.com/) — Container platform for running Nhost locally
- [Nhost CLI](https://docs.nhost.io/getting-started/installation) — Local Nhost development tooling
- [Node.js](https://nodejs.org/) — JavaScript runtime (or use [nvm](https://github.com/nvm-sh/nvm))
- [Sqitch](https://sqitch.org/) — Database change management tool

### Running Nhost Locally

Change directory into `/nhost`

```bash
cd nhost
```

Start the Nhost stack

```bash
nhost up
```

This starts Postgres, Auth, Hasura GraphQL, and Storage. The Nhost dashboard and Hasura console are available once the stack is running.

### Deploying the Database Schema

With Nhost running, change directory into `/nhost/sqitch`

```bash
cd sqitch
```

Deploy the database schema and seed data

```bash
sqitch deploy
```

### Running Next.js in Dev Mode

Change directory into `/next`

```bash
cd next
```

Install dependencies

```bash
npm i
```

Create environment file

```bash
touch .env.local
```

Fill out environment file

```txt
NHOST_REGION='local'
NHOST_SUBDOMAIN='local'
NEXT_PUBLIC_NHOST_REGION='local'
NEXT_PUBLIC_NHOST_SUBDOMAIN='local'
OPENAI_API_KEY=''
ELEVENLABS_API_URL='https://api.us.elevenlabs.io/v1'
ELEVENLABS_API_KEY=''
```

`NHOST_REGION` and `NHOST_SUBDOMAIN` are used by server-side code. `NEXT_PUBLIC_NHOST_REGION` and `NEXT_PUBLIC_NHOST_SUBDOMAIN` are used by client-side code. All four default to `local` for local development.

Run in dev mode

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Production

### Requirements

- Ubuntu 24.04 LTS server
- DNS **A record** for `moneyfi.metzark.com` pointing at the server’s public IP
- AWS security group allowing inbound **TCP 80** and **TCP 443**
- Nhost project region and subdomain (hosted Nhost, not local Docker)
- OpenAI and ElevenLabs API keys

### One-command deploy

SSH into the server, clone the repo, and run the setup script:

```bash
git clone <repo-url> moneyfi
cd moneyfi
sudo ./deploy/setup.sh
```

The script will:

1. Prompt for environment variables and write `next/.env.local`
2. Install Node.js 22, PM2, and Caddy
3. Build the Next.js app and run it under PM2 on port 3000
4. Configure Caddy to serve `https://moneyfi.metzark.com` with automatic HTTPS

Re-run the same command after pulling updates to rebuild, restart the app, and refresh config.

### Environment variables

You will be prompted for:

| Variable | Description |
| --- | --- |
| `NHOST_REGION` | Nhost project region (e.g. `us-east-1`) |
| `NHOST_SUBDOMAIN` | Nhost project subdomain |
| `OPENAI_API_KEY` | OpenAI API key |
| `ELEVENLABS_API_URL` | ElevenLabs API base URL (default: `https://api.us.elevenlabs.io/v1`) |
| `ELEVENLABS_API_KEY` | ElevenLabs API key |

`NEXT_PUBLIC_NHOST_REGION` and `NEXT_PUBLIC_NHOST_SUBDOMAIN` are set automatically from the Nhost values above.

### Operations

App status and logs:

```bash
pm2 status
pm2 logs moneyfi
pm2 restart moneyfi
```

Caddy status and logs:

```bash
sudo systemctl status caddy
sudo journalctl -u caddy -f
```

Verify the site:

```bash
curl -I https://moneyfi.metzark.com
```
