"use client";

import { Search } from "lucide-react";
import FilterButton from "./FilterButton";
import { PaymentStatus } from "@/app/types/payment";
import { PaymentFilter } from "../PaymentsManagement";

interface FiltersProps {
  search: string;
  setSearch: (e: string) => void;
  statusFilter: PaymentFilter;
  setStatusFilter: (s: PaymentFilter) => void;
}

export default function Filters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: FiltersProps) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search payment, order, or user..."
            className="h-10 w-full rounded-xl border border-white/8 bg-white/3 pl-10 pr-4 text-sm text-white outline-none transition"
          />
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </FilterButton>

          <FilterButton
            active={statusFilter === PaymentStatus.PENDING}
            onClick={() => setStatusFilter(PaymentStatus.PENDING)}
          >
            Pending
          </FilterButton>

          <FilterButton
            active={statusFilter === PaymentStatus.COMPLETED}
            onClick={() => setStatusFilter(PaymentStatus.COMPLETED)}
          >
            Completed
          </FilterButton>

          <FilterButton
            active={statusFilter === PaymentStatus.FAILED}
            onClick={() => setStatusFilter(PaymentStatus.FAILED)}
          >
            Failed
          </FilterButton>

          <FilterButton
            active={statusFilter === PaymentStatus.REFUNDED}
            onClick={() => setStatusFilter(PaymentStatus.REFUNDED)}
          >
            Refunded
          </FilterButton>
        </div>
      </div>
    </div>
  );
}
