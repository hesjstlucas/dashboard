import { NextResponse } from "next/server";
import { encodeSession, getDiscordRedirectUri, hasDiscordAuthConfig, SESSION_COOKIE } from "@/lib/auth";
import { resolveStaffByDiscordId } from "@/lib/mock-data";
import { resolveHighestRankFromRoleIds } from "@/lib/discord-role-groups";

async function exchangeCodeForUser(code, request) {
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: getDiscordRedirectUri(request)
    }),
    cache: "no-store"
  });

  if (!tokenResponse.ok) {
    throw new Error(`Discord token exchange failed with status ${tokenResponse.status}.`);
  }

  const tokenData = await tokenResponse.json();
  const userResponse = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `${tokenData.token_type} ${tokenData.access_token}`
    },
    cache: "no-store"
  });

  if (!userResponse.ok) {
    throw new Error(`Discord user lookup failed with status ${userResponse.status}.`);
  }

  return userResponse.json();
}

async function fetchGuildRoleIds(userId) {
  if (!process.env.DISCORD_GUILD_ID || !process.env.DISCORD_BOT_TOKEN) {
    return [];
  }

  const memberResponse = await fetch(
    `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
      },
      cache: "no-store"
    }
  );

  if (!memberResponse.ok) {
    return [];
  }

  const member = await memberResponse.json();
  return member.roles || [];
}

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!hasDiscordAuthConfig() || !code) {
    return NextResponse.redirect(new URL("/?login=failed", url));
  }

  try {
    const discordUser = await exchangeCodeForUser(code, request);
    const roleIds = await fetchGuildRoleIds(discordUser.id);
    const rankKey = resolveHighestRankFromRoleIds(roleIds);
    const linkedStaff = resolveStaffByDiscordId(discordUser.id);
    const session = {
      authenticated: true,
      discordUser: {
        id: discordUser.id,
        username: discordUser.username,
        globalName: discordUser.global_name || discordUser.username
      },
      linkedStaffId: linkedStaff?.id || null,
      roleIds,
      rankKey
    };

    const response = NextResponse.redirect(new URL("/", url));
    response.cookies.set(SESSION_COOKIE, encodeSession(session), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL("/?login=failed", url));
  }
}
