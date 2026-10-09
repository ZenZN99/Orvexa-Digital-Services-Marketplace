"use client";

import { CreditCard } from "lucide-react";

export default function Header() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10">
        <CreditCard size={19} className="text-brand-green" />
      </div>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Payments</h1>

        <p className="mt-0.5 text-sm text-white/35">
          View and manage your payment history.
        </p>
      </div>
    </div>
  );
}
