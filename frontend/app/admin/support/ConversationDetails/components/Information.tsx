"use client";

import InfoCard from "./InfoCard";
import { formatDateTime, userLabel } from "../utils/helpers";
import { CalendarDays, UserRound } from "lucide-react";
import { ISupportConversation } from "@/app/types/support-conversation";

interface InformationProps {
  conversation: ISupportConversation;
}

export default function Information({ conversation } : InformationProps) {
  return (
    <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
      <InfoCard
        icon={UserRound}
        label="User"
        value={userLabel(conversation.user, conversation.userId)}
      />

      <InfoCard
        icon={UserRound}
        label="Last Message Sender"
        value={userLabel(
          conversation.lastMessageSender,
          conversation.lastMessageSenderId,
        )}
      />

      <InfoCard
        icon={CalendarDays}
        label="Created"
        value={formatDateTime(conversation.createdAt)}
      />

      <InfoCard
        icon={CalendarDays}
        label="Updated"
        value={formatDateTime(conversation.updatedAt)}
      />
    </div>
  );
}
