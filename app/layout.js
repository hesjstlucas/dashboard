import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { DemoProvider } from "@/components/demo-provider";
import { NavLink } from "@/components/nav-link";

export const metadata = {
  title: "TLRP ER:LC Dashboard",
  description: "A lightweight ER:LC and Discord staff dashboard for TLRP."
};

const links = [
  { href: "/", label: "Overview" },
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DemoProvider>
          <div className="app-shell">
            <aside className="sidebar">
              <div className="brand">
                <Link href="/">
                  <Image alt="TLRP logo" height={58} priority src="/tlrp-logo.svg" width={164} />
                </Link>
                <p>TLRP operations portal</p>
              </div>
              <nav className="nav">
                {links.map((link) => (
                  <NavLink key={link.href} href={link.href}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </aside>
            <main className="content">{children}</main>
          </div>
        </DemoProvider>
      </body>
    </html>
  );
}
