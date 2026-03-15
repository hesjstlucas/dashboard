import { NextResponse } from "next/server";

export async function POST(request) {
  const { command, audience } = await request.json();
  const endpoint = process.env.ERLC_COMMAND_ENDPOINT;
  const apiKey = process.env.ERLC_API_KEY;

  if (!command) {
    return NextResponse.json({ error: "command is required." }, { status: 400 });
  }

  if (!endpoint || !apiKey) {
    return NextResponse.json({
      executed: true,
      source: "mock",
      result: `Demo executed ${audience || "staff"} command: ${command}`
    });
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ command }),
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json(
        { executed: false, error: `ER:LC command failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ executed: true, source: "remote", data });
  } catch (error) {
    return NextResponse.json({ executed: false, error: error.message }, { status: 500 });
  }
}
