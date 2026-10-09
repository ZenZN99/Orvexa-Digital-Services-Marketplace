"use client";

import { IMessage } from "@/app/types/message";
import MessageBubble from "./MessageBubble";

interface MessageGroup {
  day: string;
  items: IMessage[];
}

interface MessagesProps {
  myMessages: IMessage[];
  groupedMessages: MessageGroup[];
  currentUserId?: string;
  canChat: boolean;
  loading: {
    deleting: Record<string, boolean>;
  };
  deleteMessage: (messageId: string) => void;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

export default function Messages({
  myMessages,
  groupedMessages,
  currentUserId,
  canChat,
  loading,
  deleteMessage,
  bottomRef,
}: MessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {myMessages.length === 0 && (
          <p className="py-20 text-center text-sm text-white/25">
            No messages yet. Say hello 👋
          </p>
        )}

        {groupedMessages.map((group) => (
          <div key={group.day}>
            <div className="mb-7 mt-2 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/6" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/20">
                {group.day}
              </span>
              <div className="h-px flex-1 bg-white/6" />
            </div>

            <div className="space-y-6">
              {group.items.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isMine={m.senderId === currentUserId}
                  canDelete={canChat}
                  deleting={!!loading.deleting[m.id]}
                  onDelete={deleteMessage}
                />
              ))}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
