import { NextResponse } from "next/server";

export async function POST(request) {
  const { command, audience } = await request.json();
  const baseUrl = process.env.ERLC_API_BASE_URL || "https://api.policeroleplay.community/v2";
  const endpoint = process.env.ERLC_COMMAND_ENDPOINT || `${baseUrl.replace(/\/$/, "")}/server/command`;
  const apiKey = process.env.ERLC_API_KEY;
  const globalApiKey = process.env.ERLC_GLOBAL_API_KEY;

  if (!command) {
    return NextResponse.json({ error: "command is required." }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({
      executed: true,
      source: "mock",
      result: `Demo executed ${audience || "staff"} command: ${command}`
    });
  }

  try {
    const headers = {
      "server-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    if (globalApiKey) {
      headers.Authorization = globalApiKey;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
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
