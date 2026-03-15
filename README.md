# TLRP ER:LC Dashboard

A Next.js staff portal for TLRP with:

- A fuller Melonly-style multi-page operations portal
- Staff overview and roster search
- Grades tab
- Activity, shifts, audit logs, LOA, integrations, and settings pages
- Leaderboard with staff reviews, Staff of the Week counts, activity, and points
- Punishment logging with Discord DM notifications
- ER:LC moderation and admin command launcher
- Rank matrix for Moderation, Administration, IA, Management, and Directive
- Directive-only guideline editing

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
ERLC_COMMAND_ENDPOINT=
DISCORD_GUILD_ID=
DISCORD_BOT_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=
SESSION_SECRET=
```

If those are not set, the dashboard uses built-in mock data so the UI still works during local development. The Discord OAuth routes are still present for later, but the current portal UI does not depend on login.

## Important note

The portal currently stores roster, grades, punishments, guidelines, and module content in local browser state. For a production community portal, connect those actions to a real database before using it as your live staff source of truth.

## Test

```bash
npm test
```
