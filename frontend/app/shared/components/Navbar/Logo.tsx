"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <img
        src="/favicon.ico"
        alt="Orvexa"
        className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-105"
      />

      <span className="text-xl font-bold tracking-[-0.04em] text-white">
        Orvexa
      </span>
    </Link>
  );
}
