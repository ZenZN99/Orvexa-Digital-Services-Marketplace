"use client";

import { Clock, Loader2 } from "lucide-react";
import React from "react";

export default function PendingStatus() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-navy px-5 pt-20 text-white">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 shadow-[0_0_40px_rgba(251,191,36,0.06)]">
          <Clock size={30} strokeWidth={1.7} className="text-amber-400" />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
          Under review
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Verification submitted
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
          Your identity verification request has been submitted successfully.
          Our team will review it within the next 48 hours.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-amber-400/15 bg-amber-400/4 px-4 py-2.5 text-xs font-medium text-amber-300">
          <Loader2 size={14} className="animate-spin" />
          Review in progress
        </div>
      </div>
    </main>
  );
}
