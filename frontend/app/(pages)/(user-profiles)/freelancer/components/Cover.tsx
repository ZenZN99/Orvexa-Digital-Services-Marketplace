"use client";

import { IUser } from "@/app/types/user";
import { Edit3 } from "lucide-react";

interface CoverProps {
  user: IUser | null;
}

export default function Cover({ user }: CoverProps) {
  return (
    <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
      {user && (
        <img
          src={user.profile.cover.url}
          alt="Profile cover"
          className="h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-brand-navy via-brand-navy/20 to-transparent" />
    </div>
  );
}
