"use client";

import { Loader2, Trash2 } from "lucide-react";
import { ISupportMessage } from "@/app/types/support-message";
import { formatTime, roleConfig, isStaff } from "../utils/helpers";
import Link from "next/link";
import { UserRole } from "@/app/types/user";
import { usePresenceStore } from "@/app/stores/usePresenceStore";
import { MessagesSkeleton } from "./Skeleton";

interface MessagesProps {
  messages: ISupportMessage[];
  currentUser: {
    id: string;
    role: UserRole;
  };
  loading: {
    global: boolean;
  };
  deleteMessage: (messageId: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function Messages({
  messages,
  currentUser,
  loading,
  deleteMessage,
  messagesEndRef,
}: MessagesProps) {
  const canDelete = isStaff(currentUser.role);

  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      {loading.global ? (
        <MessagesSkeleton />
      ) : (
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((message) => {
            const isMine = message.senderId === currentUser.id;
            const sender = message.sender;
            const role = sender?.role ? roleConfig[sender.role] : null;
            const isOnline = sender ? onlineUserIds.includes(sender.id) : false;

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2.5 ${
                  isMine ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {sender?.profile?.avatar?.url ? (
                    <Link href={`/profile/u/${sender.id}`}>
                      <img
                        src={sender.profile.avatar.url}
                        alt={sender.firstName}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10"
                      />
                    </Link>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[11px] font-semibold text-white/50">
                      {sender?.firstName?.[0]}
                      {sender?.lastName?.[0]}
                    </div>
                  )}

                  {isOnline && (
                    <div className="group/status absolute -bottom-0.5 -right-0.5">
                      <span className="block h-3 w-3 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_7px_rgba(0,220,130,0.45)]" />

                      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/status:opacity-100">
                        Online
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={`group flex max-w-[75%] flex-col ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-1.5 px-1 text-[11px] text-white/30">
                    <span className="font-medium text-white/50">
                      {sender?.firstName} {sender?.lastName}
                    </span>

                    {role && (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${role.className}`}
                      >
                        {role.label}
                      </span>
                    )}
                  </div>

                  <div
                    className={`relative rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                      isMine
                        ? "rounded-br-sm bg-brand-green text-brand-navy"
                        : "rounded-bl-sm border border-white/8 bg-white/4 text-white/85"
                    }`}
                  >
                    {message.message && <p>{message.message}</p>}

                    {message.attachments?.length > 0 && (
                      <div
                        className={`flex flex-wrap gap-2 ${
                          message.message ? "mt-2" : ""
                        }`}
                      >
                        {message.attachments.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="block overflow-hidden rounded-lg"
                          >
                            <img
                              src={url}
                              alt="attachment"
                              className="h-24 w-24 object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => deleteMessage(message.id)}
                        className={`absolute top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-white/20 opacity-0 transition hover:text-red-400 group-hover:opacity-100 ${
                          isMine ? "-left-7" : "-right-7"
                        }`}
                        aria-label="Delete message"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <span className="mt-1 px-1 text-[10px] text-white/25">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
