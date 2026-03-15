# TLRP ER:LC Dashboard

A lightweight Next.js dashboard for a TLRP staff team with:

- ER:LC API connection status
- Discord API connection status
- Staff gradebook
- Discipline log
- Leaderboard
- Internal guidelines
- Rank-based editing and punishment permissions

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Environment variables

Create `.env.local` if you want live integrations:

```bash
ERLC_API_BASE_URL=
ERLC_API_KEY=
DISCORD_GUILD_ID=
DISCORD_BOT_TOKEN=
```

If those are not set, the dashboard uses built-in mock data so the UI still works during local development.

## Important note

The current rank switcher is a demo-mode staff selector so you can preview permissions without setting up auth. If you deploy this publicly, replace that with real authentication and persistent storage before using it for live staff actions.

## Test

```bash
npm test
```
