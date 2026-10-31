"use client";

import { OrderStatus } from "@/app/types/order";
import { ChevronDown, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface FiltersProps {
  search: string;
  setSearch: (event: string) => void;
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<OrderStatus | "all">>;
}

export default function Filters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: FiltersProps) {
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
          placeholder="Search order, client, service..."
          className="h-10 w-full rounded-xl border border-white/8 bg-white/3 pl-10 pr-4 text-sm text-white outline-none transition"
        />
      </div>

      <div className="relative">
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as OrderStatus | "all")
          }
          className="h-10 min-w-48 appearance-none rounded-xl border border-white/8 bg-white/3 px-4 pr-10 text-sm text-white/70 outline-none transition"
        >
          <option value="all" className="bg-brand-navy">
            All statuses
          </option>

          {Object.values(OrderStatus).map((status) => (
            <option key={status} value={status} className="bg-brand-navy">
              {status}
            </option>
          ))}
        </select>

        <ChevronDown
          size={15}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30"
        />
      </div>
    </div>
  );
}
