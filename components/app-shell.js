"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/nav-link";
import { ParalixMark } from "@/components/paralix-mark";

const dashboardLinks = [
  { href: "/portal", label: "Command" },
  { href: "/departments", label: "Departments" },
  { href: "/calls", label: "911 + Mod Calls" },
  { href: "/players", label: "Player Records" },
  { href: "/applications", label: "Applications" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/ranks", label: "Ranks" },
  { href: "/staff", label: "Staff" },
  { href: "/grades", label: "Grades" },
  { href: "/activity", label: "Activity" },
  { href: "/shifts", label: "Shifts" },
  { href: "/punishments", label: "Punishments" },
  { href: "/audit", label: "Audit Logs" },
  { href: "/loa", label: "LOA" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/integrations", label: "Integrations" },
  { href: "/settings", label: "Settings" }
];

const marketingLinks = [
  { href: "#top", label: "Home" },
  { href: "#departments", label: "Departments" },
  { href: "#info", label: "Info" },
  { href: "#apply", label: "Apply" },
  { href: "/portal", label: "Portal" }
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
              <ParalixMark showText />
            </Link>

            <nav aria-label="Primary navigation" className="marketing-nav">
              {marketingLinks.map((link) => (
                link.href.startsWith("/") ? (
                  <Link href={link.href} key={link.href}>
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href} key={link.href}>
                    {link.label}
                  </a>
                )
              ))}
            </nav>

            <a className="marketing-header-cta" href="#apply">
              Apply
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
            <ParalixMark showText />
          </Link>
          <p>Paralix live operations portal</p>
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
