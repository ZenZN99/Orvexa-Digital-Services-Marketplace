"use client";

import Link from "next/link";
import { IUser } from "@/app/types/user";
import { UserRound } from "lucide-react";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface UserProps {
  client: IUser;
}

export default function User({ client }: UserProps) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = onlineUserIds.includes(client.id);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/2.5 p-4">
      <div className="group/avatar relative h-10 w-10 shrink-0">
        {client?.profile?.avatar?.url ? (
          <Link href={`/profile/u/${client.id}`}>
            <img
              src={client.profile.avatar.url}
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

      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">
          Client
        </p>

        <p className="mt-1 text-sm font-medium text-white">
          {client?.firstName} {client?.lastName}
        </p>
      </div>
    </div>
  );
}
