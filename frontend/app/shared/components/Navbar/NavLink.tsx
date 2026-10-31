"use client";

import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="rounded-xl px-3 py-2 text-sm text-white/50 transition hover:bg-white/4 hover:text-white"
    >
      {children}
    </Link>
  );
}
