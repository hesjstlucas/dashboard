import { createHmac } from "node:crypto";

export const SESSION_COOKIE = "tlrp_session";

function getSecret() {
  return process.env.SESSION_SECRET || "tlrp-dev-session-secret";
}

function toBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function hasDiscordAuthConfig() {
  return Boolean(
    process.env.DISCORD_CLIENT_ID &&
      process.env.DISCORD_CLIENT_SECRET
  );
}

function getRequestOrigin(request) {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    return `${forwardedProto || url.protocol.replace(":", "")}://${forwardedHost}`;
  }

  return url.origin;
}

export function encodeSession(session) {
  const payload = toBase64Url(JSON.stringify(session));
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function decodeSession(token) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature || sign(payload) !== signature) {
    return null;
  }

  try {
    return JSON.parse(fromBase64Url(payload));
  } catch {
    return null;
  }
}

export function getDiscordRedirectUri(request) {
  return process.env.DISCORD_REDIRECT_URI || new URL("/api/auth/discord/callback", getRequestOrigin(request)).toString();
}

export function getDiscordAuthorizeUrl(request) {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    response_type: "code",
    redirect_uri: getDiscordRedirectUri(request),
    scope: "identify"
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}
