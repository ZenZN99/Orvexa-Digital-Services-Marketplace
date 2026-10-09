"use client";

import { ISupportConversation } from "@/app/types/support-conversation";
import TableCell from "../TableCell";
import { userLabel } from "../../../ConversationDetails/utils/helpers";

interface SenderProps {
  conversation: ISupportConversation;
  onSelect?: (conversation: ISupportConversation) => void;
}

export default function Sender({ conversation, onSelect }: SenderProps) {
  return (
    <TableCell onClick={() => onSelect?.(conversation)} clickable={!!onSelect}>
      <span className="whitespace-nowrap text-sm text-white/40">
        {userLabel(
          conversation.lastMessageSender,
          conversation.lastMessageSenderId,
        )}
      </span>
    </TableCell>
  );
}
