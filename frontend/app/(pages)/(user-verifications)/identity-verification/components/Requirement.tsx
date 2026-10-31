"use client";

import { CheckCircle2 } from "lucide-react";

export default function Requirement({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/1.5 px-3.5 py-3">
      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-brand-green/70" />

      <span className="text-xs leading-5 text-white/45">{text}</span>
    </div>
  );
}
