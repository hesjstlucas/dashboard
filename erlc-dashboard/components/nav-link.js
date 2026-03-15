"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} data-active={isActive ? "true" : "false"}>
      {children}
    </Link>
  );
}
