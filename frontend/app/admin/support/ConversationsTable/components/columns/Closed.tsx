"use client";

import TableCell from "../TableCell";
import { formatDate, formatDateTime } from "../../utils/helpers";
import { ISupportConversation } from "@/app/types/support-conversation";

interface ClosedProps {
  conversation: ISupportConversation;
  isOpen: boolean;
  onSelect?: (conversation: ISupportConversation) => void;
}

export default function Closed({
  conversation,
  isOpen,
  onSelect,
}: ClosedProps) {
  return (
    <TableCell onClick={() => onSelect?.(conversation)} clickable={!!onSelect}>
      {isOpen ? (
        <span className="text-xs text-white/20">—</span>
      ) : (
        <span
          title={formatDateTime(conversation.closedAt)}
          className="whitespace-nowrap text-xs text-white/35"
        >
          {formatDate(conversation.closedAt)}
        </span>
      )}
    </TableCell>
  );
}
