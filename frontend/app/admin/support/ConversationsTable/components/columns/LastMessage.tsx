"use client";

import { ISupportConversation } from "@/app/types/support-conversation";
import TableCell from "../TableCell";

interface LastMessageProps {
  conversation: ISupportConversation;
  onSelect?: (conversation: ISupportConversation) => void;
}

export default function LastMessage({
  conversation,
  onSelect,
}: LastMessageProps) {
  return (
    <TableCell onClick={() => onSelect?.(conversation)} clickable={!!onSelect}>
      <div className="max-w-65">
        <p
          title={conversation.lastMessage || "No message content"}
          className="truncate text-sm text-white/55"
        >
          {conversation.lastMessage || "No message content"}
        </p>
      </div>
    </TableCell>
  );
}
