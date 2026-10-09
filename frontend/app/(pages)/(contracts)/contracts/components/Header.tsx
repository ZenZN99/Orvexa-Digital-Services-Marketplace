"use client";

import { FileText } from "lucide-react";

export default function Header() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-brand-green">
          <FileText size={18} />

          <span className="text-xs font-semibold uppercase tracking-wider">
            Contracts
          </span>
        </div>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          My Contracts
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
          Track your active contracts, deliveries, completed work, and contract
          history.
        </p>
      </div>
    </div>
  );
}
