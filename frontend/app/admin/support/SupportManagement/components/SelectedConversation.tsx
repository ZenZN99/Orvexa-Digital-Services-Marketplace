"use client";

import { ShieldCheck, X } from "lucide-react";
import ConversationDetails from "../../ConversationDetails/ConversationDetails";
import { ISupportConversation } from "@/app/types/support-conversation";

interface SelectedConversationProps {
  selectedConversation: ISupportConversation | null;
  setSelectedConversationId: (id: string | null) => void;
  handleToggle: (conversationId: string) => void;
  loading: {
    closing: Record<string, boolean>;
  };
}

export default function SelectedConversation({
  selectedConversation,
  setSelectedConversationId,
  handleToggle,
  loading,
}: SelectedConversationProps) {
  return (
    <div>
      {selectedConversation && (
        <div className="rounded-2xl border border-white/[0.07] bg-white/2.5">
          <div className="flex items-center justify-between border-b border-white/6 px-5 py-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-brand-green" />

              <span className="text-sm font-medium text-white">
                Conversation Details
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedConversationId(null)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/5 hover:text-white/60"
              aria-label="Close details"
            >
              <X size={15} />
            </button>
          </div>

          <ConversationDetails
            conversation={selectedConversation}
            onClose={() => setSelectedConversationId(null)}
            onToggleConversation={() => handleToggle(selectedConversation.id)}
            toggling={!!loading.closing[selectedConversation.id]}
          />
        </div>
      )}
    </div>
  );
}
