"use client";

import {
  SupportConversationStatus,
  type ISupportConversation,
} from "@/app/types/support-conversation";
import Header from "./components/Header";
import Information from "./components/Information";
import LastMessage from "./components/LastMessage";
import ClosedInfo from "./components/ClosedInfo";
import Actions from "./components/Actions";
import EmptyState from "./components/EmptyState";

interface ConversationDetailsProps {
  conversation: ISupportConversation | null;
  onClose?: () => void;
  onToggleConversation?: (conversation: ISupportConversation) => void;
  toggling?: boolean;
}

export default function ConversationDetails({
  conversation,
  onClose,
  onToggleConversation,
  toggling,
}: ConversationDetailsProps) {
  if (!conversation) {
    return <EmptyState />;
  }

  const isOpen = conversation.status === SupportConversationStatus.OPEN;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2.5">
      <Header conversation={conversation} isOpen={isOpen} onClose={onClose} />

      <Information conversation={conversation} />

      <LastMessage conversation={conversation} />

      <ClosedInfo isOpen={isOpen} conversation={conversation} />

      <Actions
        conversation={conversation}
        onToggleConversation={onToggleConversation}
        toggling={toggling}
        isOpen={isOpen}
      />
    </div>
  );
}
