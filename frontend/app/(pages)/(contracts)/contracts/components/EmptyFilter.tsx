"use client";

import { Search } from "lucide-react";
import React from "react";

interface EmptyFilterProps {
  clearFilters: () => void;
}

export default function EmptyFilter({ clearFilters }: EmptyFilterProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
        <Search size={22} className="text-white/20" />
      </div>

      <h3 className="mt-4 text-sm font-medium text-white/60">
        No matching contracts
      </h3>

      <p className="mt-1 max-w-sm text-xs leading-5 text-white/30">
        Try changing your search or selected status filter.
      </p>

      <button
        type="button"
        onClick={clearFilters}
        className="mt-5 rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-xs font-medium text-white/45 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
      >
        Clear filters
      </button>
    </div>
  );
}
