"use client";

import { MessageSquare } from "lucide-react";
import type { ISupportConversation } from "@/app/types/support-conversation";
import { SupportConversationStatus } from "@/app/types/support-conversation";
import Head from "./components/Head";
import EmptyState from "./components/EmptyState";
import Pagination from "@/app/shared/components/Pagination";

interface ConversationsTableProps {
  conversations: ISupportConversation[];
  selectedConversationId?: string | null;
  onSelectConversation?: (conversation: ISupportConversation) => void;
  onToggleConversation?: (conversationId: string) => void;
  togglingIds?: Record<string, boolean>;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ConversationsTable({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onToggleConversation,
  togglingIds = {},
  page,
  totalPages,
  onPageChange,
}: ConversationsTableProps) {
  if (conversations.length === 0) {
    return <EmptyState />;
  }

  const openCount = conversations.filter(
    (conversation) => conversation.status === SupportConversationStatus.OPEN,
  ).length;

  const closedCount = conversations.filter(
    (conversation) => conversation.status === SupportConversationStatus.CLOSED,
  ).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2.5">
      <div className="overflow-x-auto">
        <Head
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={onSelectConversation}
          onToggleConversation={onToggleConversation}
          togglingIds={togglingIds}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/6 px-5 py-4">
        <div className="flex flex-wrap items-center gap-5">
          <span className="text-xs text-white/30">
            {conversations.length}{" "}
            {conversations.length === 1 ? "conversation" : "conversations"}
          </span>

          <span className="flex items-center gap-1.5 text-xs text-white/30">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            {openCount} open
          </span>

          <span className="flex items-center gap-1.5 text-xs text-white/30">
            <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
            {closedCount} closed
          </span>
        </div>

        <span className="text-xs text-white/25">
          Select a conversation to view details
        </span>
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
