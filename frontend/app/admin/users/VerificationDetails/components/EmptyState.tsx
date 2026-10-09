"use client";

import { FileCheck2 } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="relative flex min-h-80 flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/[0.035] blur-3xl" />
      </div>

      {/* Icon */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.035] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/4.5">
          <FileCheck2 size={21} strokeWidth={1.6} className="text-white/35" />
        </div>
      </div>

      {/* Content */}
      <div className="relative mt-6">
        <h3 className="text-sm font-semibold tracking-tight text-white/75">
          No verification selected
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/35">
          Select a verification request from the list to view its details.
        </p>
      </div>

      {/* Hint */}
      <div className="relative mt-5 flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/2.5 px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />

        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/30">
          Awaiting selection
        </span>
      </div>
    </div>
  );
}
