"use client";

import { IUser } from "@/app/types/user";
import { User } from "lucide-react";
import { IFreelancer } from "@/app/types/freelancer";
import QuickStats from "./QuickStats";
import Rating from "./Rating";
import Name from "./Name";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface AvatarProps {
  user: IUser | null;
  freelancer: IFreelancer | null;
}

export default function Avatar({ user, freelancer }: AvatarProps) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = user ? onlineUserIds.includes(user.id) : false;

  return (
    <div className="relative flex flex-col items-center px-5 pb-8">
      <div className="-mt-20">
        <div className="relative">
          <div className="h-40 w-40 overflow-hidden rounded-4xl border-[5px] border-brand-navy bg-brand-navy shadow-2xl shadow-black/30">
            {user?.profile.avatar ? (
              <img
                src={user.profile.avatar.url}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/6">
                <User size={52} className="text-white/25" />
              </div>
            )}
          </div>

          {isOnline && (
            <div className="group/status absolute bottom-1 right-1">
              <span className="block h-5 w-5 rounded-full border-4 border-brand-navy bg-brand-green shadow-[0_0_12px_rgba(0,220,130,0.45)]" />

              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/status:opacity-100">
                Online
              </span>
            </div>
          )}
        </div>
      </div>

      <Name user={user} />

      <p className="mt-2 text-sm text-white/45">{freelancer?.jobTitle}</p>

      <Rating freelancer={freelancer} />

      <QuickStats freelancer={freelancer} />
    </div>
  );
}
