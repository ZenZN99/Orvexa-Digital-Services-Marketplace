"use client";

import { Loader2, Power } from "lucide-react";
import TableCell from "../TableCell";
import { ISupportConversation } from "@/app/types/support-conversation";

interface ActionsProps {
  conversation: ISupportConversation;
  isOpen: boolean;
  onToggle?: (conversationId: string) => void;
  toggling: boolean;
}

export default function Actions({
  conversation,
  isOpen,
  onToggle,
  toggling,
}: ActionsProps) {
  return (
    <TableCell>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.(conversation.id);
        }}
        disabled={toggling}
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
          isOpen
            ? "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/15"
            : "border-brand-green/20 bg-brand-green/10 text-brand-green hover:bg-brand-green/15"
        }`}
      >
        {toggling ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Power size={12} />
        )}
        {isOpen ? "Close" : "Reopen"}
      </button>
    </TableCell>
  );
}
