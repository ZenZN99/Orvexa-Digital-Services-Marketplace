"use client";

import { INotification } from "@/app/types/notification";
import { Bell } from "lucide-react";

interface StatsProps {
  myNotifications: INotification[];
  unreadCount: number;
}

export default function Stats({ myNotifications, unreadCount }: StatsProps) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
            <Bell size={17} />
          </div>

          <div>
            <p className="text-xs text-white/35">Total</p>

            <p className="mt-1 text-xl font-bold text-white">
              {myNotifications.length}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
            <Bell size={17} />
          </div>

          <div>
            <p className="text-xs text-white/35">Unread</p>

            <p className="mt-1 text-xl font-bold text-white">{unreadCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
