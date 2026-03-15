import { NextResponse } from "next/server";
import { encodeSession, hasDiscordAuthConfig, SESSION_COOKIE } from "@/lib/auth";
import { resolveStaffByDiscordId } from "@/lib/mock-data";

async function exchangeCodeForUser(code) {
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
      redirect_uri: process.env.DISCORD_REDIRECT_URI
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

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!hasDiscordAuthConfig() || !code) {
    return NextResponse.redirect(new URL("/?login=failed", url));
  }

  try {
    const discordUser = await exchangeCodeForUser(code);
    const linkedStaff = resolveStaffByDiscordId(discordUser.id);
    const session = {
      authenticated: true,
      discordUser: {
        id: discordUser.id,
        username: discordUser.username,
        globalName: discordUser.global_name || discordUser.username
      },
      linkedStaffId: linkedStaff?.id || null
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
