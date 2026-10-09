"use client";

import { ContractStatus } from "@/app/types/contract";
import { Search } from "lucide-react";
import React from "react";

interface SearchFilterProps {
  search: string;
  setSearch: (value: string) => void;
  statusFilter: ContractStatus | "all";
  setStatusFilter: (value: ContractStatus | "all") => void;
}

export default function SearchFilter({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/2.5 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search contract, order, service..."
          className="h-10 w-full rounded-xl border border-white/8 bg-white/3 pl-10 pr-4 text-sm text-white outline-none transition"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value as ContractStatus | "all")
        }
        className="h-10 min-w-44 rounded-xl border border-white/8 bg-white/3 px-4 text-sm text-white/70 outline-none transition"
      >
        <option value="all" className="bg-brand-navy">
          All statuses
        </option>

        {Object.values(ContractStatus).map((status) => (
          <option key={status} value={status} className="bg-brand-navy">
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}
