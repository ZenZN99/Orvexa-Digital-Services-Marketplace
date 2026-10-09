"use client";

import { MessageSquare } from "lucide-react";
import React from "react";

export default function EmptyState() {
  return (
    <div className="flex min-h-105 flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/2.5 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/4">
        <MessageSquare size={22} className="text-white/20" />
      </div>

      <h3 className="mt-4 text-sm font-medium text-white/60">
        No conversation selected
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-white/30">
        Select a support conversation to view its details.
      </p>
    </div>
  );
}
