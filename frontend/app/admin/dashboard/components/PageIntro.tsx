"use client";

import { RefreshCw } from "lucide-react";
import Reveal from "./Reveal";

interface PageIntroProps {
  refreshAll: () => void;
  refreshing: boolean;
}

export default function PageIntro({ refreshAll, refreshing }: PageIntroProps) {
  return (
    <Reveal delay={0}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-green">
            Overview
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
            Platform Overview
          </h2>

          <p className="mt-1 text-sm text-white/40">
            Monitor the overall activity and performance of Orvexa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/2.5 px-3 py-1.5 text-[11px] text-white/45">
            <span className="relative flex h-2 w-2">
              <span className="dash-ping absolute inline-flex h-full w-full rounded-full bg-brand-green" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
            </span>
            Live data
          </div>

          <button
            type="button"
            onClick={refreshAll}
            disabled={refreshing}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.07] bg-white/2.5 text-white/45 transition-all duration-300 hover:border-brand-green/30 hover:bg-brand-green/10 hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Refresh dashboard"
            title="Refresh"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>
    </Reveal>
  );
}
