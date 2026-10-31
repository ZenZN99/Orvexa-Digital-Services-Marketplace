"use client";

import { SupportConversationStatus } from "@/app/types/support-conversation";
import { Dispatch, SetStateAction } from "react";

interface ResultInfoProps {
  filteredConversations: unknown[];
  conversations: unknown[];
  search: string;
  statusFilter: "all" | SupportConversationStatus;
  setSearch: Dispatch<SetStateAction<string>>;
  setStatusFilter: Dispatch<SetStateAction<"all" | SupportConversationStatus>>;
}

export default function ResultInfo({
  filteredConversations,
  conversations,
  search,
  statusFilter,
  setSearch,
  setStatusFilter,
}: ResultInfoProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs text-white/25">
        Showing{" "}
        <span className="text-white/50">{filteredConversations.length}</span> of{" "}
        <span className="text-white/50">{conversations.length}</span>{" "}
        conversations
      </p>

      {(search || statusFilter !== "all") && (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
          }}
          className="text-xs font-medium text-brand-green/70 transition hover:text-brand-green"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
