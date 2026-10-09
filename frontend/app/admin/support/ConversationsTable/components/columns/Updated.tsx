"use client";

import { ISupportConversation } from "@/app/types/support-conversation";
import TableCell from "../TableCell";
import { formatDate, formatDateTime } from "../../utils/helpers";

interface UpdatedProps {
  conversation: ISupportConversation;
  onSelect?: (conversation: ISupportConversation) => void;
}

export default function Updated({ conversation, onSelect }: UpdatedProps) {
  return (
    <TableCell onClick={() => onSelect?.(conversation)} clickable={!!onSelect}>
      <span
        title={formatDateTime(conversation.updatedAt)}
        className="whitespace-nowrap text-xs text-white/30"
      >
        {formatDate(conversation.updatedAt)}
      </span>
    </TableCell>
  );
}
