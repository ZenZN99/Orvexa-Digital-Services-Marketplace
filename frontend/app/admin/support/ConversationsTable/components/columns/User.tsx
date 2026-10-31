"use client";

import Link from "next/link";
import TableCell from "../TableCell";
import { userLabel } from "../../../ConversationDetails/utils/helpers";
import { ISupportConversation } from "@/app/types/support-conversation";
import { UserRound } from "lucide-react";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface UserProps {
  conversation: ISupportConversation;
  onSelect?: (conversation: ISupportConversation) => void;
}

export default function User({ conversation, onSelect }: UserProps) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = conversation.user
    ? onlineUserIds.includes(conversation.user.id)
    : false;

  return (
    <TableCell onClick={() => onSelect?.(conversation)} clickable={!!onSelect}>
      <div className="flex items-center gap-2.5">
        <div className="group/avatar relative h-7 w-7 shrink-0">
          {conversation.user?.profile?.avatar?.url ? (
            <Link
              href={`/profile/u/${conversation.user.id}`}
              className="block h-7 w-7"
            >
              <img
                src={conversation.user.profile.avatar.url}
                alt=""
                className="h-7 w-7 rounded-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </Link>
          ) : (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/6">
              <UserRound size={13} className="text-white/35" />
            </div>
          )}

          {isOnline && (
            <>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_7px_rgba(0,220,130,0.45)]" />

              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
                Online
              </span>
            </>
          )}
        </div>

        <span className="whitespace-nowrap text-sm text-white/55">
          {userLabel(conversation.user, conversation.userId)}
        </span>
      </div>
    </TableCell>
  );
}
