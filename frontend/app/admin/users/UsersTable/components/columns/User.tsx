"use client";

import { IUser } from "@/app/types/user";
import { getInitials } from "../../utils/getInitials";
import { usePresenceStore } from "@/app/stores/usePresenceStore";
import Link from "next/link";

interface UserProps {
  user: IUser;
  onSelectUser?: (user: IUser) => void;
}

export default function User({ user, onSelectUser }: UserProps) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = onlineUserIds.includes(user.id);

  return (
    <td className="px-5 py-4">
      <button
        type="button"
        onClick={() => onSelectUser?.(user)}
        className="flex items-center gap-3 text-left"
      >
        <div className="group/avatar relative h-10 w-10 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand-navy text-xs font-bold text-white transition-all duration-300 hover:scale-110">
            {user.profile?.avatar?.url ? (
              <Link href={`/profile/u/${user.id}`}>
                <img
                  src={user.profile.avatar.url}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-full w-full object-cover"
                />
              </Link>
            ) : (
              getInitials(user)
            )}
          </div>

          {isOnline && (
            <>
              <span className="absolute bottom-0 right-0 z-10 h-3.5 w-3.5 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_8px_rgba(0,220,130,0.45)]" />

              <span className="pointer-events-none absolute bottom-full left-1/2  mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
                Online
              </span>
            </>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {user.firstName} {user.lastName}
          </p>

          <p className="mt-0.5 text-xs text-white/40">{user.email}</p>
        </div>
      </button>
    </td>
  );
}
