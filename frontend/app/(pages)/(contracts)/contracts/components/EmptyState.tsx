"use client";

import { FileText } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
        <FileText size={22} className="text-white/20" />
      </div>

      <h3 className="mt-4 text-sm font-medium text-white/60">
        No contracts yet
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-white/30">
        Your contracts will show up here once an order gets paid.
      </p>
    </div>
  );
}
