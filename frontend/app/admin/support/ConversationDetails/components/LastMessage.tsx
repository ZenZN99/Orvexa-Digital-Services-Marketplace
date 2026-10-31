"use client";

import { MessageSquare } from "lucide-react";
import { userLabel } from "../utils/helpers";
import { ISupportConversation } from "@/app/types/support-conversation";

interface LastMessageProps {
  conversation: ISupportConversation;
}

export default function LastMessage({ conversation }: LastMessageProps) {
  return (
    <div className="border-t border-white/6 px-5 py-5">
      <div className="mb-3 flex items-center gap-2">
        <MessageSquare size={14} className="text-white/30" />

        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/35">
          Last Message
        </h3>
      </div>

      <div className="rounded-xl border border-white/6 bg-white/2.5 px-4 py-3.5">
        <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-white/65">
          {conversation.lastMessage || (
            <span className="text-white/25">No message content</span>
          )}
        </p>
      </div>

      <div className="mt-2 text-[11px] text-white/25">
        Sent by{" "}
        <span className="text-white/40">
          {userLabel(
            conversation.lastMessageSender,
            conversation.lastMessageSenderId,
          )}
        </span>
      </div>
    </div>
  );
}
