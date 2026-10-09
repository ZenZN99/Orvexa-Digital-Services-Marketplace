"use client";

import { Clock3, ShieldCheck } from "lucide-react";
import { formatDate } from "../utils/helpers";

export default function InfoCards({ lastSynced }: { lastSynced: Date | null }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* Status */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/35">
              Wallet Status
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green/60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-green" />
              </span>

              <span className="text-sm font-semibold text-white">Active</span>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10">
            <ShieldCheck className="h-5 w-5 text-brand-green" />
          </div>
        </div>
      </div>

      {/* Last sync */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-white/35">
              Last Synced
            </p>

            <p className="mt-3 truncate text-sm font-semibold text-white">
              {formatDate(lastSynced)}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-400/10">
            <Clock3 className="h-5 w-5 text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
