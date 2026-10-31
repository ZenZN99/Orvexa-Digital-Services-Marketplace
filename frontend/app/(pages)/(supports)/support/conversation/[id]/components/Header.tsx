"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SupportConversationStatus } from "@/app/types/support-conversation";
import { ISupportConversation } from "@/app/types/support-conversation";

interface HeaderProps {
  otherPartyLabel: string;
  conversation: ISupportConversation | null;
}

export default function Header({ otherPartyLabel, conversation }: HeaderProps) {
  return (
    <header className="z-10 flex items-center gap-3 border-b border-white/8 bg-brand-navy/90 px-4 py-3.5 backdrop-blur-xl">
      <Link
        href="/support"
        className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition hover:bg-white/5 hover:text-white"
      >
        <ArrowLeft size={18} />
      </Link>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
        <img src="/favicon.ico" alt="" className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {otherPartyLabel}
        </p>

        <p className="text-xs text-white/35">
          {conversation?.status === SupportConversationStatus.OPEN
            ? "Open"
            : "Closed"}{" "}
          conversation
        </p>
      </div>
    </header>
  );
}
