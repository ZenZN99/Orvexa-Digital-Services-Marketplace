"use client";

import { Check, Loader2 } from "lucide-react";

interface HeaderProps {
  unreadCount: number;
  markAllNotificationsAsRead: () => void;
  loading: {
    markingAllAsRead: boolean;
  };
}

export default function Header({
  unreadCount,
  markAllNotificationsAsRead,
  loading,
}: HeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
          Notifications
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Your Notifications
        </h1>

        <p className="mt-2 text-sm leading-6 text-white/35">
          Stay updated with your latest activity and account events.
        </p>
      </div>

      {unreadCount > 0 && (
        <button
          type="button"
          onClick={markAllNotificationsAsRead}
          disabled={loading.markingAllAsRead}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 px-4 text-xs font-semibold text-white/60 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading.markingAllAsRead ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Check size={14} />
          )}
          Mark all as read
        </button>
      )}
    </div>
  );
}
