"use client";

import { SupportConversationStatus } from "@/app/types/support-conversation";
import { Search, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { statusOptions } from "../utils/helpers";

interface FiltersProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  statusFilter: "all" | SupportConversationStatus;
  setStatusFilter: Dispatch<SetStateAction<"all" | SupportConversationStatus>>;
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
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
        />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search conversations, users, or messages..."
          className="h-10 w-full rounded-xl border border-white/8 bg-white/3 pl-10 pr-10 text-sm text-white outline-none  transition"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/6 hover:text-white/60"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {statusOptions.map((option) => {
          const active = statusFilter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatusFilter(option.value)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
                active
                  ? "border-brand-green/20 bg-brand-green/10 text-brand-green"
                  : "border-white/[0.07] bg-white/2.5 text-white/35 hover:border-white/12 hover:bg-white/5 hover:text-white/60"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
