# MoneyFi

An AI financial advising service powered by Next.js, Nhost, OpenAI, and ElevenLabs.

## Project Structure

- `nhost/` — Backend (Postgres, Auth, Hasura GraphQL) and database migrations
- `next/` — Next.js frontend

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
