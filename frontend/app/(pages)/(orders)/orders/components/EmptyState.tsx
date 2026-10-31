"use client";

import { Package } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/2.5 py-24 text-center">
      <Package size={42} className="mx-auto text-white/15" />

      <h2 className="mt-5 text-lg font-semibold text-white">No orders yet</h2>

      <p className="mt-2 text-sm text-white/35">
        Orders you place will show up here.
      </p>
    </div>
  );
}
