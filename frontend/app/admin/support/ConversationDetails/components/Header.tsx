"use client";

import { CheckCircle2, Clock3, MessageSquare, X } from "lucide-react";
import { statusClasses, userLabel } from "../utils/helpers";
import { ISupportConversation } from "@/app/types/support-conversation";
import { MouseEventHandler } from "react";

interface HeaderProps {
  conversation: ISupportConversation;
  isOpen: boolean;
  onClose?: MouseEventHandler<HTMLButtonElement>;
}

export default function Header({ conversation, isOpen, onClose }: HeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        {conversation.user?.profile?.avatar?.url ? (
          <img
            src={conversation.user.profile.avatar.url}
            alt=""
            className="h-10 w-10 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
            <MessageSquare size={18} />
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {userLabel(conversation.user, conversation.userId)}
          </p>

          <p className="mt-0.5 truncate text-[11px] text-white/30">
            {conversation.user?.email ?? conversation.id}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClasses[conversation.status]}`}
        >
          {isOpen ? <CheckCircle2 size={12} /> : <Clock3 size={12} />}
          {conversation.status}
        </span>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/5 hover:text-white/70"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
