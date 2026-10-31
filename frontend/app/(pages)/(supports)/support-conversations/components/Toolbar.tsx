"use client";

import React from "react";
import { Search } from "lucide-react";
import { SupportConversationStatus } from "@/app/types/support-conversation";

interface ToolbarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filter: "all" | SupportConversationStatus;
  setFilter: React.Dispatch<
    React.SetStateAction<"all" | SupportConversationStatus>
  >;
}

export default function Toolbar({
  search,
  setSearch,
  filter,
  setFilter,
}: ToolbarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="relative flex-1">
        <Search
          size={14}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user or message..."
          className="w-full rounded-lg border border-white/7 bg-white/2.5 py-2.5 pl-9 pr-3 text-sm text-white outline-none"
        />
      </div>

      <div className="flex gap-1.5">
        {(
          [
            "all",
            SupportConversationStatus.OPEN,
            SupportConversationStatus.CLOSED,
          ] as const
        ).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium capitalize transition ${
              filter === key
                ? "border-brand-green/40 bg-brand-green/15 text-brand-green"
                : "border-white/[0.07] bg-white/2.5 text-white/50 hover:text-white/80"
            }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
