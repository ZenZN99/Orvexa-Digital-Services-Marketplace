"use client";

import { CreditCard } from "lucide-react";

export default function Header() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
          <CreditCard size={19} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Payments Management
          </h2>

          <p className="mt-0.5 text-xs text-white/35">
            Monitor payment activity, statuses, and transaction amounts.
          </p>
        </div>
      </div>
    </div>
  );
}
