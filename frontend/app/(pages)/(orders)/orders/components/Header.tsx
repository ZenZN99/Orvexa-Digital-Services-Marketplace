"use client";

import { Package } from "lucide-react";

export default function Header() {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
          <Package size={21} />
        </div>

        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="mt-1 text-sm text-white/40">
            Track and manage your orders
          </p>
        </div>
      </div>

      <div className="mt-6 h-px bg-white/8" />
    </div>
  );
}
