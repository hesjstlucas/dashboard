import { NextResponse } from "next/server";
import { getDiscordSummary } from "@/lib/mock-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const guildId = process.env.DISCORD_GUILD_ID;
  const token = process.env.DISCORD_BOT_TOKEN;
  const resource = searchParams.get("resource") || "guild";

  if (!guildId || !token) {
    return NextResponse.json({
      configured: false,
      source: "mock",
      resource,
      data: getDiscordSummary()
    });
  }

  const endpoints = {
    guild: `https://discord.com/api/v10/guilds/${guildId}`,
    members: `https://discord.com/api/v10/guilds/${guildId}/members?limit=25`
  };

  const target = endpoints[resource] || endpoints.guild;

  try {
    const response = await fetch(target, {
      headers: {
        Authorization: `Bot ${token}`,
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          configured: true,
          source: "remote",
          error: `Discord request failed with status ${response.status}.`
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      configured: true,
      source: "remote",
      resource,
      data
    });
  } catch (error) {
    return NextResponse.json(
      {
        configured: true,
        source: "remote",
        error: error.message
      },
      { status: 500 }
    );
  }
}
