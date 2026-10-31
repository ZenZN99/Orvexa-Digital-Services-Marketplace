"use client";

import { CheckCircle2 } from "lucide-react";

export default function VerificationSuccess() {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-brand-green/10 bg-brand-green/4 px-4 py-3">
      <CheckCircle2 size={15} className="text-brand-green" />

      <p className="text-xs text-white/45">
        This account has successfully completed identity verification.
      </p>
    </div>
  );
}
