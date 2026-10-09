"use client";

import { IUser } from "@/app/types/user";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface AvatarProps {
  user?: IUser | null;
  size?: "sm" | "md";
}

export default function Avatar({ user, size = "md" }: AvatarProps) {
  const avatarUrl = user?.profile.avatar.url;
  const sizeClass = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = user ? onlineUserIds.includes(user.id) : false;

  return (
    <div className="group/avatar relative shrink-0">
      <div
        className={`${sizeClass} overflow-hidden rounded-xl border border-white/8 bg-white/5 transition-all duration-300 hover:scale-110`}
      >
        {avatarUrl ? (
          <Link href={`/profile/u/${user.id}`}>
            <img
              src={avatarUrl}
              alt={user ? `${user.firstName} ${user.lastName}` : "User"}
              className="h-full w-full object-cover"
            />
          </Link>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/30">
            <UserRound size={size === "sm" ? 14 : 17} />
          </div>
        )}
      </div>

      {isOnline && (
        <>
          <span
            className={`absolute bottom-0 right-0 ${
              size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"
            } rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_8px_rgba(0,220,130,0.45)]`}
          />

          <span className="pointer-events-none absolute bottom-full  left-1/2 z-9999 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
            Online
          </span>
        </>
      )}
    </div>
  );
}
