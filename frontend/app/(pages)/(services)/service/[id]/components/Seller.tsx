"use client";

import { IUser } from "@/app/types/user";
import Link from "next/link";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface SellerProps {
  user?: IUser;
}

export default function Seller({ user }: SellerProps) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = user ? onlineUserIds.includes(user.id) : false;

  return (
    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-4">
      <div className="relative shrink-0">
        {user?.profile.avatar ? (
          <Link href={`/freelancer/u/${user.id}`}>
            <img
              src={user.profile.avatar.url}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-12 w-12 rounded-full object-cover"
            />
          </Link>
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-brand-navy">
            {user?.firstName.charAt(0).toUpperCase()}
            {user?.lastName.charAt(0).toUpperCase()}
          </div>
        )}

        {isOnline && (
          <div className="group/status absolute bottom-0 right-0">
            <span className="block h-3.5 w-3.5 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_8px_rgba(0,220,130,0.45)]" />

            <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/status:opacity-100">
              Online
            </span>
          </div>
        )}
      </div>

      <div>
        <p className="text-xs text-white/40">Service by</p>

        <h3 className="font-semibold text-white">
          {user?.firstName} {user?.lastName}
        </h3>
      </div>
    </div>
  );
}
