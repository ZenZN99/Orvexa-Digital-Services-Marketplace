"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

import TableCell from "../TableCell";
import { ISupportConversation } from "@/app/types/support-conversation";

interface ConversationProps {
  conversation: ISupportConversation;
  selected: boolean;
  onSelect?: (conversation: ISupportConversation) => void;
}

export default function Conversation({
  conversation,
  selected,
  onSelect,
}: ConversationProps) {
  return (
    <TableCell
      onClick={() => onSelect?.(conversation)}
      clickable={!!onSelect}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            selected
              ? "bg-brand-green/10 text-brand-green"
              : "bg-white/5 text-white/30"
          }`}
        >
          <MessageSquare size={15} />
        </div>

        <div className="min-w-0">
          <Link
            href={`/support/conversation/${conversation.id}`}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex items-center text-sm font-medium text-white/70 transition hover:text-brand-green"
          >
            View
          </Link>

         
        </div>
      </div>
    </TableCell>
  );
}