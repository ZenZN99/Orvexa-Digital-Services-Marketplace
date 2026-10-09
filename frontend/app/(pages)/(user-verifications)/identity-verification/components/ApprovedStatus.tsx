"use client";

import { CheckCircle2, Sparkles } from "lucide-react";

export default function ApprovedStatus() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-navy px-5 pt-20 text-white">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-green/20 bg-brand-green/10 shadow-[0_0_40px_rgba(0,220,130,0.06)]">
          <Sparkles size={30} strokeWidth={1.7} className="text-brand-green" />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-green">
          Verified
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Congratulations! Your identity has been verified
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
          All platform features have been unlocked for your account.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-brand-green/20 bg-brand-green/10 px-5 py-3 text-sm font-semibold text-brand-green">
          <CheckCircle2 size={17} />
          Identity verified successfully
        </div>
      </div>
    </main>
  );
}
