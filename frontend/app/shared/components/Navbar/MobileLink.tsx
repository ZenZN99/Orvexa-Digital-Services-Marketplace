"use client";

import Link from "next/link";

interface MobileLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function MobileLink({
  href,
  children,
  onClick,
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-3 text-sm text-white/60 transition hover:bg-white/4 hover:text-white"
    >
      {children}
    </Link>
  );
}
