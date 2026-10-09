"use client";

import React from "react";
import Avatar from "./Avatar";
import { statusLabel } from "../utils/helpers";
import { IContract } from "@/app/types/contract";
import { IUser } from "@/app/types/user";

interface ChatHeaderProps {
  otherUser?: IUser;
  canChat: boolean;
  contract: IContract;
}

export default function ChatHeader({
  otherUser,
  canChat,
  contract,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-white/8 px-5 py-4 sm:px-6">
      <Avatar user={otherUser} size="md" />

      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold">
          {otherUser
            ? `${otherUser.firstName} ${otherUser.lastName}`
            : "Conversation"}
        </h2>

        <div className="mt-1 flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              canChat ? "bg-brand-green" : "bg-white/20"
            }`}
          />
          <span className="text-[11px] text-white/30">
            {canChat ? "Active contract" : statusLabel(contract.status)}
          </span>
        </div>
      </div>
    </header>
  );
}
