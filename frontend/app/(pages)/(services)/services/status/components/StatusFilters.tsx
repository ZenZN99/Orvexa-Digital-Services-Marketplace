"use client";

import { ServiceStatus } from "@/app/types/service";
import { Filter } from "../page";

interface ServiceCounts {
  all: number;
  [ServiceStatus.PENDING]: number;
  [ServiceStatus.REJECTED]: number;
  [ServiceStatus.PUBLISHED]: number;
}

interface StatusFiltersProps {
  tabs: { key: Filter; label: string }[];
  filter: Filter;
  setFilter: (tab: Filter) => void;
  counts: ServiceCounts;
}

export default function StatusFilters({
  tabs,
  filter,
  setFilter,
  counts,
}: StatusFiltersProps) {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = filter === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
              active
                ? "border-brand-green/40 bg-brand-green/10 text-brand-green"
                : "border-white/10 bg-white/3 text-white/50 hover:bg-white/6"
            }`}
          >
            {tab.label}
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
              {counts[tab.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
