"use client";

import { Search } from "lucide-react";
import FilterButton from "./FilterButton";
import { ServiceCategory, ServiceStatus } from "@/app/types/service";

interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;

  statusFilter: ServiceStatus | "all";
  setStatusFilter: (value: ServiceStatus | "all") => void;

  categoryFilter: ServiceCategory | "all";
  setCategoryFilter: (value: ServiceCategory | "all") => void;

  categories: ServiceCategory[];
}

export default function Filters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
}: FiltersProps) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-4">
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-full">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search service, freelancer, title, or keyword..."
            className="h-10 w-full rounded-xl border border-white/8 bg-white/3 pl-10 pr-4 text-sm text-white outline-none transition "
          />
        </div>

        {/* Status */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-medium text-white/25">
            Status:
          </span>

          <FilterButton
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </FilterButton>

          {Object.values(ServiceStatus).map((status) => (
            <FilterButton
              key={status}
              active={statusFilter === status}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </FilterButton>
          ))}
        </div>

        {/* Category */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[11px] font-medium text-white/25">
            Category:
          </span>

          <FilterButton
            active={categoryFilter === "all"}
            onClick={() => setCategoryFilter("all")}
          >
            All
          </FilterButton>

          {categories.map((category) => (
            <FilterButton
              key={category}
              active={categoryFilter === category}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </FilterButton>
          ))}
        </div>
      </div>
    </div>
  );
}
