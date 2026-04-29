import { NextResponse } from "next/server";
import { getErlcSummary } from "@/lib/mock-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const baseUrl = process.env.ERLC_API_BASE_URL || "https://api.policeroleplay.community/v2";
  const apiKey = process.env.ERLC_API_KEY;
  const globalApiKey = process.env.ERLC_GLOBAL_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      source: "mock",
      data: getErlcSummary()
    });
  }

  try {
    const endpoint = new URL(`${baseUrl.replace(/\/$/, "")}/server`);
    for (const [key, value] of searchParams.entries()) {
      endpoint.searchParams.set(key, value);
    }

    const headers = {
      "server-key": apiKey,
      Accept: "application/json"
    };

    if (globalApiKey) {
      headers.Authorization = globalApiKey;
    }

    const response = await fetch(endpoint, {
      headers: {
        ...headers
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          configured: true,
          source: "remote",
          error: `ER:LC request failed with status ${response.status}.`
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      configured: true,
      source: "remote",
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
