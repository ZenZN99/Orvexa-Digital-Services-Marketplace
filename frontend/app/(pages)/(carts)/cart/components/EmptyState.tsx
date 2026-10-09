"use client";

import { ShoppingBag } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="mt-10 rounded-2xl border border-white/8 bg-white/2.5 py-24 text-center">
      <ShoppingBag size={42} className="mx-auto text-white/15" />

      <h2 className="mt-5 text-lg font-semibold text-white">
        Your cart is empty
      </h2>

      <p className="mt-2 text-sm text-white/35">
        Add services you are interested in to your cart.
      </p>
    </div>
  );
}
