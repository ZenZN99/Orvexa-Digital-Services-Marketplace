"use client";

import { Package } from "lucide-react";

export default function Header() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
          <Package size={19} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Services Management
          </h2>

          <p className="mt-0.5 text-xs text-white/35">
            Review, filter, and monitor services submitted by freelancers.
          </p>
        </div>
      </div>
    </div>
  );
}
