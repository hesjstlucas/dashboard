import { NextResponse } from "next/server";
import { getDiscordAuthorizeUrl, hasDiscordAuthConfig } from "@/lib/auth";

export async function GET(request) {
  const fallbackUrl = new URL("/?login=discord-not-configured", request.url);

  if (!hasDiscordAuthConfig()) {
    return NextResponse.redirect(fallbackUrl);
  }

  return NextResponse.redirect(getDiscordAuthorizeUrl());
}
