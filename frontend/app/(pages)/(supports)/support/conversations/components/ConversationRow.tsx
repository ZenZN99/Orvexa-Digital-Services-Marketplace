"use client";

import Link from "next/link";
import {
  ISupportConversation,
  SupportConversationStatus,
} from "@/app/types/support-conversation";
import { formatDate } from "../utils/formats";

export default function ConversationRow({
  conversation,
}: {
  conversation: ISupportConversation;
}) {
  const isOpen = conversation.status === SupportConversationStatus.OPEN;

  return (
    <Link
      href={`/support/conversation/${conversation.id}`}
      className="block rounded-2xl border border-white/8 bg-white/2.5 p-5 transition hover:border-brand-green/25 hover:bg-white/[0.035]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {conversation.user?.profile?.avatar?.url ? (
            <img
              src={conversation.user.profile.avatar.url}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/10"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white/50">
              {conversation.user?.firstName?.[0]}
              {conversation.user?.lastName?.[0]}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {conversation.user
                ? `${conversation.user.firstName} ${conversation.user.lastName}`
                : "Conversation"}
            </p>
            <p className="mt-0.5 text-xs text-white/35">
              {isOpen
                ? `Started ${formatDate(conversation.createdAt)}`
                : `Closed ${formatDate(conversation.closedAt)}`}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
            isOpen
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-white/10 bg-white/5 text-white/40"
          }`}
        >
          {conversation.status}
        </span>
      </div>

      {conversation.lastMessage && (
        <p className="mt-4 line-clamp-2 rounded-xl border border-white/6 bg-white/2 p-3 text-sm leading-6 text-white/55">
          {conversation.lastMessageSender &&
            `${conversation.lastMessageSender.firstName}: `}
          {conversation.lastMessage}
        </p>
      )}

      <p className="mt-3 text-xs text-white/30">
        Updated {formatDate(conversation.updatedAt)}
      </p>
    </Link>
  );
}
