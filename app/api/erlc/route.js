import { NextResponse } from "next/server";
import { getErlcSummary } from "@/lib/mock-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource") || "server-status";
  const baseUrl = process.env.ERLC_API_BASE_URL;
  const apiKey = process.env.ERLC_API_KEY;

  if (!baseUrl || !apiKey) {
    return NextResponse.json({
      configured: false,
      source: "mock",
      resource,
      data: getErlcSummary()
    });
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/${resource}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json"
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
