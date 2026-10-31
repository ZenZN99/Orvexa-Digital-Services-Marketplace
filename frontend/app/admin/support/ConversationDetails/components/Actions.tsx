"use client";

import { ISupportConversation } from "@/app/types/support-conversation";
import { Loader2, Power } from "lucide-react";

interface ActionsProps {
  conversation: ISupportConversation;
  onToggleConversation?: (conversation: ISupportConversation) => void;
  toggling?: boolean;
  isOpen: boolean;
}

export default function Actions({
  conversation,
  onToggleConversation,
  toggling,
  isOpen,
}: ActionsProps) {
  return (
    <div>
      {onToggleConversation ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/6 px-5 py-4">
          <div>
            <p className="text-xs font-medium text-white/50">
              {isOpen
                ? "Conversation is currently open"
                : "Conversation is currently closed"}
            </p>

            <p className="mt-0.5 text-[11px] text-white/25">
              {isOpen
                ? "Close it when the support request has been resolved."
                : "Reopen it if the user needs further assistance."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onToggleConversation(conversation)}
            disabled={toggling}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
              isOpen
                ? "bg-red-500 text-white hover:bg-red-500/90"
                : "bg-brand-green text-brand-navy hover:bg-brand-green/90"
            }`}
          >
            {toggling ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Power size={14} />
            )}
            {isOpen ? "Close Conversation" : "Reopen Conversation"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
