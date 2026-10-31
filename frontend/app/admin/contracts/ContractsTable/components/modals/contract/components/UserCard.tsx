"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface UserCardProps {
  label: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  id: string;
}

export default function UserCard({
  label,
  firstName,
  lastName,
  avatar,
  id,
}: UserCardProps) {
  const onlineUserIds = usePresenceStore(
    (state) => state.onlineUserIds,
  );

  const isOnline = onlineUserIds.includes(id);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/2.5 p-4">
      <div className="group/avatar relative h-10 w-10 shrink-0">
        {avatar ? (
          <Link href={`/profile/u/${id}`}>
            <img
              src={avatar}
              alt=""
              className="h-10 w-10 rounded-full object-cover transition-all duration-300 hover:scale-110"
            />
          </Link>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
            <UserRound size={17} className="text-white/25" />
          </div>
        )}

        {isOnline && (
          <>
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_8px_rgba(0,220,130,0.45)]" />

            <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
              Online
            </span>
          </>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-medium text-white">
          {firstName} {lastName}
        </p>
      </div>
    </div>
  );
}