"use client";

import TableCell from "../TableCell";
import { CheckCircle2, Clock3 } from "lucide-react";
import { ISupportConversation } from "@/app/types/support-conversation";
import { supportStatusClasses } from "../../utils/helpers";

interface StatusProps {
  conversation: ISupportConversation;
  isOpen: boolean;
  onSelect?: (conversation: ISupportConversation) => void;
}

export default function Status({
  conversation,
  isOpen,
  onSelect,
}: StatusProps) {
  return (
    <TableCell onClick={() => onSelect?.(conversation)} clickable={!!onSelect}>
      <span
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${supportStatusClasses[conversation.status]}`}
      >
        {isOpen ? <CheckCircle2 size={12} /> : <Clock3 size={12} />}
        {conversation.status}
      </span>
    </TableCell>
  );
}
