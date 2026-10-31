"use client";

import { ISupportConversation } from "@/app/types/support-conversation";
import { Loader2, MessagesSquare, Plus } from "lucide-react";

interface HeaderProps {
  myConversations: ISupportConversation[];
  handleStart: () => void;
  creating: boolean;
  hasOpenConversation: boolean;
}

export default function Header({
  myConversations,
  handleStart,
  creating,
  hasOpenConversation,
}: HeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
          <MessagesSquare size={21} />
        </div>

        <div>
          <h1 className="text-xl font-bold">Support</h1>

          <p className="mt-1 text-sm text-white/40">
            {myConversations.length} conversation
            {myConversations.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleStart}
        disabled={creating || hasOpenConversation}
        className="flex h-10 items-center gap-2 rounded-xl bg-brand-green px-4 text-sm font-semibold text-brand-navy transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        title={
          hasOpenConversation
            ? "You already have an open conversation"
            : undefined
        }
      >
        {creating ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Plus size={15} />
        )}
        New conversation
      </button>
    </div>
  );
}
