import { NextResponse } from "next/server";

export async function POST(request) {
  const { discordId, message } = await request.json();
  const token = process.env.DISCORD_BOT_TOKEN;

  if (!discordId || !message) {
    return NextResponse.json({ error: "discordId and message are required." }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({
      sent: false,
      source: "mock",
      note: "Discord bot token is not configured, so the DM was logged only in demo mode."
    });
  }

  try {
    const channelResponse = await fetch("https://discord.com/api/v10/users/@me/channels", {
      method: "POST",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ recipient_id: discordId })
    });

    if (!channelResponse.ok) {
      return NextResponse.json(
        { sent: false, error: `Failed to open DM channel: ${channelResponse.status}` },
        { status: channelResponse.status }
      );
    }

    const channel = await channelResponse.json();
    const messageResponse = await fetch(`https://discord.com/api/v10/channels/${channel.id}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content: message })
    });

    if (!messageResponse.ok) {
      return NextResponse.json(
        { sent: false, error: `Failed to send DM: ${messageResponse.status}` },
        { status: messageResponse.status }
      );
    }

    return NextResponse.json({ sent: true, source: "discord" });
  } catch (error) {
    return NextResponse.json({ sent: false, error: error.message }, { status: 500 });
  }
}
