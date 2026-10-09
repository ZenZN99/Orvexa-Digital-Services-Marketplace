"use client";

import { Search } from "lucide-react";

interface ToolbarProps {
  search: string;
  changeSearch: (value: string) => void;
  clearFilters: () => void;
  page: number;
  totalPages: number;
}

export default function Toolbar({
  search,
  changeSearch,
  clearFilters,
  page,
  totalPages,
}: ToolbarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search
          size={17}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => changeSearch(event.target.value)}
          placeholder="Search freelancers by name, email or bio..."
          className="h-11 w-full rounded-xl border border-white/8 bg-white/3 pl-10 pr-4 text-sm outline-none transition placeholder:text-white/20"
        />
      </div>

      <div className="flex items-center gap-3">
        {search && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-white/30 transition hover:text-brand-green"
          >
            Clear search
          </button>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/2 px-3 py-2">
          <span className="text-xs text-white/30">Page</span>

          <span className="text-sm font-semibold text-white">{page}</span>

          <span className="text-xs text-white/20">/ {totalPages}</span>
        </div>
      </div>
    </div>
  );
}
