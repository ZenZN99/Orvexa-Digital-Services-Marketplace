"use client";

import { IUser } from "@/app/types/user";
import React from "react";

export default function Footer({ users }: { users: IUser[] }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-5 py-4">
      <p className="text-xs text-white/45">
        Showing <span className="font-semibold text-white">{users.length}</span>{" "}
        users
      </p>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-white/50">
            {users.filter((user) => user.isActive).length} active
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-white/50">
            {users.filter((user) => !user.isActive).length} blocked
          </span>
        </div>
      </div>
    </div>
  );
}
