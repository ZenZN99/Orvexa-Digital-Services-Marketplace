"use client";

import {
  ISupportConversation,
  SupportConversationStatus,
} from "@/app/types/support-conversation";
import Conversation from "./columns/Conversation";
import User from "./columns/User";
import LastMessage from "./columns/LastMessage";
import Sender from "./columns/Sender";
import Status from "./columns/Status";
import ClosedBy from "./columns/ClosedBy";
import Created from "./columns/Created";
import Updated from "./columns/Updated";
import Closed from "./columns/Closed";
import Actions from "./columns/Actions";

interface ConversationRowProps {
  conversation: ISupportConversation;
  selected: boolean;
  onSelect?: (conversation: ISupportConversation) => void;
  onToggle?: (conversationId: string) => void;
  toggling: boolean;
}

export default function ConversationRow({
  conversation,
  selected,
  onSelect,
  onToggle,
  toggling,
}: ConversationRowProps) {
  const isOpen = conversation.status === SupportConversationStatus.OPEN;

  return (
    <tr
      className={`border-b border-white/5 transition-colors last:border-0 ${
        selected ? "bg-brand-green/4.5" : ""
      } hover:bg-white/2.5`}
    >
      <Conversation
        conversation={conversation}
        selected={selected}
        onSelect={onSelect}
      />
      <User conversation={conversation} onSelect={onSelect} />

      <LastMessage conversation={conversation} onSelect={onSelect} />

      <Sender conversation={conversation} onSelect={onSelect} />

      <Status conversation={conversation} isOpen={isOpen} onSelect={onSelect} />

      <ClosedBy
        conversation={conversation}
        isOpen={isOpen}
        onSelect={onSelect}
      />

      <Created conversation={conversation} onSelect={onSelect} />

      <Updated conversation={conversation} onSelect={onSelect} />

      <Closed conversation={conversation} isOpen={isOpen} onSelect={onSelect} />

      <Actions
        conversation={conversation}
        isOpen={isOpen}
        onToggle={onToggle}
        toggling={toggling}
      />
    </tr>
  );
}
