# Paralix ER:LC Operations Portal

A Next.js website and staff dashboard for a realistic ER:LC community.

## Included

- Public Paralix website with department info and application entry points
- Police, medical, DOT, and fire department dashboards
- Player search fed by ER:LC Players and JoinLogs when the PRC API key is configured
- Patient intake records with age, disabilities, allergies, description, treatment, and status
- Police records that are manual only, so nobody is marked criminal unless staff saves a record
- DOT and fire record sections
- Live 911 calls and moderator calls using PRC API v2 server data
- Applications queue with IA+ review controls
- Staff leaderboard, grades, punishments, ranks, audit logs, LOA, shifts, settings, and guidelines
- Rank-gated promotion and demotion tools for department members
- Discord OAuth role mapping for production permissions

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If Discord OAuth is not configured, the site enables a local Director preview so you can test the full dashboard.

## ER:LC API setup

Create `.env.local`:

```bash
ERLC_API_KEY=your_private_server_key
ERLC_API_BASE_URL=https://api.policeroleplay.community/v2
ERLC_GLOBAL_API_KEY=
ERLC_COMMAND_ENDPOINT=
DISCORD_GUILD_ID=
DISCORD_BOT_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
SESSION_SECRET=
```

The portal uses PRC API v2 with the `server-key` header. It requests:

- `Players=true`
- `Staff=true`
- `JoinLogs=true`
- `Queue=true`
- `KillLogs=true`
- `CommandLogs=true`
- `ModCalls=true`
- `EmergencyCalls=true`
- `Vehicles=true`

The player vault keeps seen players in browser storage during local/demo use. For a real production server, connect these actions to a database so every staff member shares the same records and historical player list.

## Discord role groups

Edit [discord-role-groups.js](/C:/Users/heher/Documents/Playground/erlc-dashboard/lib/discord-role-groups.js) and replace the placeholder role IDs in each group:

- `moderation`
- `administration`
- `ia`
- `management`
- `directive`

When a user logs in, the app reads their Discord guild roles and assigns the highest matching website rank.

## Test

```bash
npm test
```
