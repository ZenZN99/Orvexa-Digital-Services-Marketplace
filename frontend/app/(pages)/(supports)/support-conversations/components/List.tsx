"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import type { ISupportConversation } from "@/app/types/support-conversation";
import ConversationRow from "./ConversationRow";

interface ListProps {
  filtered: ISupportConversation[];
}

export default function List({ filtered }: ListProps) {
  return (
    <div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/2.5 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/4">
            <MessageSquare size={26} className="text-white/20" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            No conversations
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
            No conversations match your search or filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((conversation) => (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
