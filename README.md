# MoneyFi

An AI financial advising service

## Development

### Running Supabase Locally

Change directory into /supa

```bash
cd supa
```

Install dependencies

```bash
npm i
```

Start supabase stack

```bash
npx start supabase
```

Change directory into /sqitch

```bash
cd sqitch
```

Deploy database schema

```bash
sqitch deploy
```

### Running NextJS in Dev Mode

Change directoy into /next

```bash
cd next
```

Install dependencies

```
npm i
```

Create environment file

```bash
touch .env.local
```

Fill out environment file

```txt
NEXT_PUBLIC_SUPABASE_URL='http://127.0.0.1:54321'
NEXT_PUBLIC_SUPABASE_ANON_KEY='' # Found in the Supabase dashboard
OPENAI_API_KEY=''
ELEVENLABS_API_URL='https://api.us.elevenlabs.io/v1'
ELEVENLABS_API_KEY=''
```

Run in dev mode

```bash
npm run dev
```
