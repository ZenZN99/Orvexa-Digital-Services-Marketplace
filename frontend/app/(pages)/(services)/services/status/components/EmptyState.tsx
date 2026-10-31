"use client";

import { Package } from "lucide-react";
import React from "react";

export default function EmptyState({ hasServices }: { hasServices: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/2.5 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/4">
        <Package size={22} className="text-white/20" />
      </div>

      <h3 className="mt-4 text-sm font-medium text-white/60">
        {hasServices ? "No services in this status" : "No services yet"}
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-white/30">
        {hasServices
          ? "Try another filter to see your other services."
          : "Create your first service and it will appear here with its review status."}
      </p>
    </div>
  );
}
