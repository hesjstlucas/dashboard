import "./globals.css";
import Link from "next/link";
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
  { href: "/punishments", label: "Punishments" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/ranks", label: "Ranks" },
  { href: "/guidelines", label: "Guidelines" }
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
                  <h1>TLRP</h1>
                </Link>
                <p>Discord and ER:LC staff dashboard</p>
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
