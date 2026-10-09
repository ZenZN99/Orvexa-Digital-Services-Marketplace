"use client";

import { ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-green/20 bg-brand-green/10 shadow-[0_0_40px_rgba(0,220,130,0.06)]">
        <ShieldCheck size={30} strokeWidth={1.7} className="text-brand-green" />
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-green">
        Identity verification
      </p>

      <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        Verify your identity
      </h1>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/40">
        Confirm your identity to help keep Orvexa safe and trusted for everyone.
      </p>
    </div>
  );
}
