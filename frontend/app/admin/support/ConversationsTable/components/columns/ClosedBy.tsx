"use client";

import { ISupportConversation } from "@/app/types/support-conversation";
import { userLabel } from "../../../ConversationDetails/utils/helpers";
import TableCell from "../TableCell";

interface ClosedByProps {
  conversation: ISupportConversation;
  isOpen: boolean;
  onSelect?: (conversation: ISupportConversation) => void;
}

export default function ClosedBy({
  conversation,
  isOpen,
  onSelect,
}: ClosedByProps) {
  return (
    <TableCell onClick={() => onSelect?.(conversation)} clickable={!!onSelect}>
      {isOpen ? (
        <span className="text-xs text-white/20">—</span>
      ) : (
        <span className="whitespace-nowrap text-xs text-white/40">
          {userLabel(
            conversation.closedByUser ?? undefined,
            conversation.closedBy ?? undefined,
          )}
        </span>
      )}
    </TableCell>
  );
}
