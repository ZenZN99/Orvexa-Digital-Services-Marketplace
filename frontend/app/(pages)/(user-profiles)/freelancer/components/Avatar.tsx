"use client";

import { IUser } from "@/app/types/user";

interface AvatarProps {
  user: IUser;
}

export default function Avatar({ user }: AvatarProps) {
  return (
    <div className="relative -mt-20">
      <div className="h-40 w-40 overflow-hidden rounded-4xl border-[5px] border-brand-navy bg-brand-navy shadow-2xl shadow-black/30">
        {user && (
          <img
            src={user.profile.avatar.url}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
