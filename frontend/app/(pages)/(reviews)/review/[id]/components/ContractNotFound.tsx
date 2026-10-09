"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ContractNotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy px-5 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/6 blur-3xl" />

      <div className="relative w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-white/3 shadow-2xl">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7 text-white/40"
          >
            <path
              d="M9 12h6M9 16h6M9 8h3M6 3h9l3 3v15H6V3Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Content */}
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-brand-green/70">
          Contract
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Contract not found
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/35">
          The contract you are looking for may have been removed or is no longer
          available.
        </p>

        {/* Action */}
        <Link
          href="/contracts"
          className="mx-auto mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-green px-5 text-sm font-semibold text-brand-navy transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
        >
          <ArrowLeft size={16} />
          Back to contracts
        </Link>
      </div>
    </main>
  );
}
