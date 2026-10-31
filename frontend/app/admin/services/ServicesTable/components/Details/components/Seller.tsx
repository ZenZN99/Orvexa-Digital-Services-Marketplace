"use client";

import { IService } from "@/app/types/service";
import { IUser } from "@/app/types/user";
import Link from "next/link";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface SellerProps {
  service: IService;
  user: IUser;
}

export default function Seller({ service, user }: SellerProps) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = user ? onlineUserIds.includes(user.id) : false;

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/2 p-5">
      <h2 className="text-sm font-semibold text-white">Seller</h2>

      <div className="mt-4 flex items-center gap-3">
        <div className="group/avatar relative h-12 w-12 shrink-0">
          {user?.profile?.avatar?.url ? (
            <Link href={`/freelancer/u/${user.id}`}>
              <img
                src={user.profile.avatar.url}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-12 w-12 rounded-full object-cover ring-1 ring-white/10 transition-all duration-300 hover:scale-110"
              />
            </Link>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white/50">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
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
          <p className="truncate text-sm font-semibold text-white">
            {user?.firstName} {user?.lastName}
          </p>

          <p className="truncate text-xs text-white/30">
            {user?.email ?? `Freelancer ID: ${service.freelancerId}`}
          </p>
        </div>
      </div>
    </section>
  );
}
