"use client";

import { ContractStatus, IContract } from "@/app/types/contract";
import { Search, X } from "lucide-react";
import { statusConfig } from "../utils/helpers";

interface SearchFiltersProps {
  search: string;
  setSearch: (value: string) => void;

  statusFilter: ContractStatus | "all";
  setStatusFilter: (value: ContractStatus | "all") => void;

  hasFilters: boolean;
  filteredContracts: IContract[];
  myContracts: IContract[];

  clearFilters: () => void;
}

export default function SearchFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  hasFilters,
  filteredContracts,
  myContracts,
  clearFilters,
}: SearchFiltersProps) {
  return (
    <div className="border-b border-white/6 px-5 py-4 sm:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-sm">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search contracts..."
            className="h-10 w-full rounded-xl border border-white/8 bg-white/2.5 pl-9 pr-9 text-xs text-white outline-none transition"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-white/60"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg border px-3 py-2 text-[11px] font-medium transition ${
              statusFilter === "all"
                ? "border-brand-green/20 bg-brand-green/10 text-brand-green"
                : "border-white/8 bg-white/3 text-white/35 hover:bg-white/5 hover:text-white/60"
            }`}
          >
            All
          </button>

          {Object.entries(statusConfig).map(([status, config]) => {
            const isActive = statusFilter === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status as ContractStatus)}
                className={`rounded-lg border px-3 py-2 text-[11px] font-medium transition ${
                  isActive
                    ? config.className
                    : "border-white/8 bg-white/3 text-white/35 hover:bg-white/5 hover:text-white/60"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {hasFilters && (
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[11px] text-white/25">
            Showing{" "}
            <span className="text-white/50">{filteredContracts.length}</span> of{" "}
            <span className="text-white/50">{myContracts.length}</span>{" "}
            contracts
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="text-[11px] text-white/30 transition hover:text-brand-green"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
