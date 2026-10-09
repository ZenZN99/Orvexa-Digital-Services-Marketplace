"use client";

import { CalendarDays } from "lucide-react";
import { formatDate, formatDateTime } from "../../utils/helpers";
import TableCell from "../TableCell";
import { ISupportConversation } from "@/app/types/support-conversation";

interface CreatedProps {
  conversation: ISupportConversation;
  onSelect?: (conversation: ISupportConversation) => void;
}

export default function Created({ conversation, onSelect }: CreatedProps) {
  return (
    <TableCell onClick={() => onSelect?.(conversation)} clickable={!!onSelect}>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <CalendarDays size={13} className="text-white/25" />

        <span
          title={formatDateTime(conversation.createdAt)}
          className="text-xs text-white/40"
        >
          {formatDate(conversation.createdAt)}
        </span>
      </div>
    </TableCell>
  );
}
