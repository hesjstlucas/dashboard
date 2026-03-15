"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/components/demo-provider";

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

export function PageFrame({ title, description, children }) {
  const pathname = usePathname();
  const { currentUser, visibleStaff, abilities, setActiveStaffId } = useDemo();

  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <div className="kicker">TLRP Control Panel</div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="panel auth-panel stack">
          <div className="kicker">Operator</div>
          <strong>{currentUser.displayName}</strong>
          <span className="muted">{abilities.rank.label}</span>
          <select
            aria-label="Select active operator"
            onChange={(event) => setActiveStaffId(event.target.value)}
            value={currentUser.id}
          >
            {visibleStaff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.displayName} | {member.rankKey}
              </option>
            ))}
          </select>
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
