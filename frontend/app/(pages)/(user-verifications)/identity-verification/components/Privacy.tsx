"use client";

import { ShieldCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="mt-5 flex gap-3 rounded-2xl border border-white/6 bg-white/[0.012] p-4">
      <ShieldCheck size={17} className="mt-0.5 shrink-0 text-white/30" />

      <p className="text-xs leading-5 text-white/35">
        Your identity information should only be used for verification purposes.
        Never upload someone else's identity document or submit false
        information.
      </p>
    </div>
  );
}
