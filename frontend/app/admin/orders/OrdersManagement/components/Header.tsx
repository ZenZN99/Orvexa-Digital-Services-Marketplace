"use client";

import { ShoppingBag } from "lucide-react";
import React from "react";

export default function Header() {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <ShoppingBag size={18} className="text-brand-green" strokeWidth={1.8} />

        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
          Orders
        </span>
      </div>

      <h2 className="text-xl font-semibold tracking-tight text-white">
        Order Management
      </h2>

      <p className="mt-1 text-sm text-white/40">
        Monitor orders, services, contracts, and payment status.
      </p>
    </div>
  );
}
