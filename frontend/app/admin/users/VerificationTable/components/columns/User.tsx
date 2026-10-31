"use client";

import { UserRound } from "lucide-react";
import TableCell from "@/app/admin/components/TableCell";
import { IUser } from "@/app/types/user";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface UserProps {
  user: IUser;
}

export default function User({ user }: UserProps) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = onlineUserIds.includes(user.id);

  return (
    <TableCell>
      <div className="flex items-center gap-3">
        <div className="group/avatar relative h-9 w-9 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/6">
            {user?.profile?.avatar?.url ? (
              <img
                src={user.profile.avatar.url}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={15} className="text-white/30" />
            )}
          </div>

          {isOnline && (
            <>
              <span className="absolute bottom-0 right-0 z-10 h-3 w-3 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_8px_rgba(0,220,130,0.45)]" />

              <span className="pointer-events-none absolute bottom-full left-1/2  mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
                Online
              </span>
            </>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {user ? `${user.firstName} ${user.lastName}` : "—"}
          </p>

          <p className="mt-0.5 max-w-40 truncate text-[11px] text-white/25">
            {user.email}
          </p>
        </div>
      </div>
    </TableCell>
  );
}
