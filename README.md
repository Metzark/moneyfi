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
- Node.js and a production build of the Next.js app (see below)

### Reverse Proxy (Caddy)

Caddy terminates HTTPS for `moneyfi.metzark.com` and forwards traffic to Next.js on `localhost:3000`. Certificates are obtained and renewed automatically via Let’s Encrypt.

From the repo root on the server:

```bash
sudo ./deploy/setup-caddy.sh
```

The script installs Caddy from the official repository, copies `deploy/Caddyfile` to `/etc/caddy/Caddyfile`, validates the config, and starts the service.

Check status or logs:

```bash
sudo systemctl status caddy
sudo journalctl -u caddy -f
```

Re-run the script after updating `deploy/Caddyfile` to redeploy config changes.

### Running Next.js in Production

Build and start the app on the same host as Caddy:

```bash
cd next
npm ci
npm run build
npm start
```

The app listens on port 3000 by default. Caddy proxies public HTTPS traffic to it.

Verify the site:

```bash
curl -I https://moneyfi.metzark.com
```
