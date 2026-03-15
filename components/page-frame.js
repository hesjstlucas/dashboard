"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/components/demo-provider";

const links = [
  { href: "/", label: "Overview" },
  { href: "/staff", label: "Staff" },
  { href: "/grades", label: "Grades" },
  { href: "/punishments", label: "Punishments" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/ranks", label: "Ranks" },
  { href: "/guidelines", label: "Guidelines" }
];

export function PageFrame({ title, description, children }) {
  const pathname = usePathname();
  const { currentUser, sessionState, abilities, logout } = useDemo();

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <div className="kicker">TLRP Staff Systems</div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="panel auth-panel">
          <div className="kicker">Discord Access</div>
          {sessionState.authenticated ? (
            <div className="stack">
              <strong>{currentUser.displayName}</strong>
              <span className="muted">{abilities.rank.label}</span>
              <button className="secondary" onClick={logout} type="button">
                Log out
              </button>
            </div>
          ) : (
            <div className="stack">
              <span className="muted">
                Staff identities stay hidden until a user signs in through Discord.
              </span>
              <a className="button-link" href="/api/auth/discord/login">
                Continue with Discord
              </a>
            </div>
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
