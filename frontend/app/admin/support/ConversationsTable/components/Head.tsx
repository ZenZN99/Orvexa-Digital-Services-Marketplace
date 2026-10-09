"use client";

import { ISupportConversation } from "@/app/types/support-conversation";
import TableHead from "@/app/admin/components/TableHead";
import ConversationRow from "./ConversationRow";

interface HeadProps {
  conversations: ISupportConversation[];
  selectedConversationId?: string | null;
  onSelectConversation?: (conversation: ISupportConversation) => void;
  onToggleConversation?: (conversationId: string) => void;
  togglingIds?: Record<string, boolean>;
}

export default function Head({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onToggleConversation,
  togglingIds,
}: HeadProps) {
  return (
    <table className="w-full min-w-7xl">
      <thead>
        <tr className="border-b border-white/[0.07] bg-white/2">
          <TableHead>Conversation</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Last Message</TableHead>
          <TableHead>Sender</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Closed By</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead>Closed</TableHead>
          <TableHead>Actions</TableHead>
        </tr>
      </thead>

      <tbody>
        {conversations.map((conversation) => {
          const selected = selectedConversationId === conversation.id;

          return (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              selected={selected}
              onSelect={onSelectConversation}
              onToggle={onToggleConversation}
              toggling={!!togglingIds![conversation.id]}
            />
          );
        })}
      </tbody>
    </table>
  );
}
