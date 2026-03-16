"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/nav-link";
import { TLRPMark } from "@/components/tlrp-mark";

const dashboardLinks = [
  { href: "/portal", label: "Overview" },
  { href: "/staff", label: "Staff" },
  { href: "/grades", label: "Grades" },
  { href: "/activity", label: "Activity" },
  { href: "/shifts", label: "Shifts" },
  { href: "/punishments", label: "Punishments" },
  { href: "/audit", label: "Audit Logs" },
  { href: "/loa", label: "LOA" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/ranks", label: "Ranks" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/integrations", label: "Integrations" },
  { href: "/settings", label: "Settings" }
];

const marketingLinks = [
  { href: "#top", label: "Home" },
  { href: "#rules", label: "Rules" },
  { href: "#departments", label: "Departments" },
  { href: "#discord", label: "Discord" }
];

export function AppShell({ children }) {
  const pathname = usePathname();
  const isMarketingHome = pathname === "/";

  if (isMarketingHome) {
    return (
      <div className="marketing-shell">
        <header className="marketing-header">
          <div className="marketing-header-inner">
            <Link className="marketing-brand-link" href="/">
              <TLRPMark showText />
            </Link>

            <nav aria-label="Primary navigation" className="marketing-nav">
              {marketingLinks.map((link) => (
                <a href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>

            <a className="marketing-header-cta" href="#discord">
              Join
            </a>
          </div>
        </header>

        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Link href="/">
            <TLRPMark showText />
          </Link>
          <p>TLRP operations portal</p>
        </div>

        <nav className="nav">
          {dashboardLinks.map((link) => (
            <NavLink href={link.href} key={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link className="button-link" href="/">
            Public Home
          </Link>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
