"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useDemo } from "@/components/demo-provider";
import { CommandBar } from "@/components/command-bar";

const links = [
  { href: "/", label: "Overview" },
  { href: "/staff", label: "Staff" },
  { href: "/grades", label: "Grades" },
  { href: "/activity", label: "Activity" },
  { href: "/shifts", label: "Shifts" },
  { href: "/punishments", label: "Punishments" },
  { href: "/audit", label: "Audit" },
  { href: "/loa", label: "LOA" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/ranks", label: "Ranks" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/integrations", label: "Integrations" },
  { href: "/settings", label: "Settings" }
];

function LoginNotice() {
  const searchParams = useSearchParams();
  const status = searchParams.get("login");

  if (!status) {
    return null;
  }

  const messages = {
    failed: "Discord login failed. Check your Discord OAuth redirect URL and try again.",
    "discord-not-configured": "Discord OAuth is not configured yet. Add the Discord env vars in Vercel."
  };

  return <div className="list-item notice-banner">{messages[status] || "Discord login status changed."}</div>;
}

export function PageFrame({ title, description, children }) {
  const pathname = usePathname();
  const { currentUser, abilities, sessionState, logout } = useDemo();
  const isAuthenticated = sessionState.authenticated;
  const isLinked = currentUser.id !== "guest";

  return (
    <div className="stack">
      <Suspense fallback={null}>
        <LoginNotice />
      </Suspense>
      <CommandBar />

      <header className="page-header">
        <div>
          <div className="kicker">TLRP Control Panel</div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="panel auth-panel stack">
          <div className="kicker">Discord Account</div>
          <strong>
            {isAuthenticated
              ? sessionState.session?.discordUser?.globalName || currentUser.displayName
              : "Not signed in"}
          </strong>
          <span className="muted">
            {isLinked
              ? `${abilities.rank.label} | ${currentUser.discordTag}`
              : isAuthenticated
                ? "Logged in, but this Discord account is not linked to a seeded staff record yet."
                : sessionState.configured
                ? "Login unlocks your staff identity and permissions."
                : "Configure Discord OAuth env vars to enable login."}
          </span>
          {isAuthenticated ? (
            <button className="secondary" onClick={logout} type="button">
              Log out
            </button>
          ) : (
            <a className="button-link" href="/api/auth/discord/login">
              Continue with Discord
            </a>
          )}
        </div>
      </header>

      <div className="mobile-nav">
        {links.map((link) => (
          <Link key={link.href} data-active={pathname === link.href ? "true" : "false"} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
