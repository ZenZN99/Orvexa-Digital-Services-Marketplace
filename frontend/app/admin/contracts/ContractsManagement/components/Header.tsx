"use client";

import { FileText } from "lucide-react";

export default function Header() {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <FileText size={18} className="text-brand-green" strokeWidth={1.8} />

        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
          Contracts
        </span>
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-white">
        Contract Management
      </h2>

      <p className="mt-1 text-sm text-white/40">
        Monitor contracts and conversations between clients and freelancers.
      </p>
    </div>
  );
}
