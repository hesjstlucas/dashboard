import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decodeSession, hasDiscordAuthConfig, SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  return NextResponse.json({
    authenticated: Boolean(session?.authenticated),
    configured: hasDiscordAuthConfig(),
    session
  });
}
