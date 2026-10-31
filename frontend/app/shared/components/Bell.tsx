"use client";

import Link from "next/link";
import { Bell, CheckCircle2, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAuthStore } from "@/app/stores/useAuthStore";
import { useNotifications } from "@/app/hooks/useNotifications";
import { useNotificationStore } from "@/app/stores/useNotificationStore";

function formatTime(date?: Date | string) {
  if (!date) return "";

  const createdAt = new Date(date);

  if (Number.isNaN(createdAt.getTime())) return "";

  const now = new Date();
  const diff = Math.max(0, now.getTime() - createdAt.getTime());

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return createdAt.toLocaleDateString();
}

export default function BellIcon() {
  const { currentUser } = useAuthStore();

  // Only used to trigger the initial REST fetch (which also seeds the store).
  const { loading } = useNotifications();

  // Live data: updated instantly by the socket listeners in useNotificationStore.
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !loading.global && !!currentUser;

  const latestNotifications = notifications.slice(0, 5);

  const hasMoreNotifications = notifications.length > 5;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${
          isOpen
            ? "border-brand-green/25 bg-white/5 text-white"
            : "border-white/7 bg-white/2.5 text-white/50 hover:border-brand-green/20 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Bell size={17} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-brand-green px-1 text-[9px] font-bold leading-none text-brand-navy shadow-[0_0_10px_rgba(0,220,130,0.4)]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 origin-top-right">
          {/* Arrow */}
          <span className="absolute -top-1 right-4 h-2.5 w-2.5 rotate-45 border-l border-t border-white/10 bg-brand-navy" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-brand-navy/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
            {/* Soft glow */}
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-brand-green/10 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between px-4 pb-2.5 pt-3.5">
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] font-semibold tracking-tight text-white">
                  Notifications
                </h3>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-brand-green/15 px-2 py-0.5 text-[10px] font-semibold text-brand-green">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-white/25 transition hover:bg-white/5 hover:text-white/60"
                aria-label="Close notifications"
              >
                <X size={13} />
              </button>
            </div>

            <div className="mx-4 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />

            {/* Notifications */}
            {latestNotifications.length > 0 ? (
              <div className="relative max-h-80 space-y-0.5 overflow-y-auto p-1.5 scrollbar-thin [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
                {latestNotifications.map((notification) => {
                  const senderName = [
                    notification.sender?.firstName,
                    notification.sender?.lastName,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <div
                      key={notification.id}
                      className={`group relative flex gap-2.5 rounded-xl px-2.5 py-2.5 transition ${
                        notification.isRead
                          ? "hover:bg-white/3"
                          : "bg-brand-green/4 hover:bg-brand-green/7"
                      }`}
                    >
                      {/* Unread bar */}
                      {!notification.isRead && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand-green" />
                      )}

                      {/* Clickable overlay */}
                      {notification.link && (
                        <Link
                          href={notification.link}
                          onClick={() => setIsOpen(false)}
                          aria-label={notification.message}
                          className="absolute inset-0 z-10 rounded-xl"
                        />
                      )}

                      {/* Avatar */}
                      {notification.sender?.profile?.avatar?.url ? (
                        <Link
                          href={`/profile/u/${notification.sender.id}`}
                          onClick={() => setIsOpen(false)}
                          aria-label={senderName || "Sender profile"}
                          className="relative z-20 shrink-0 self-start"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={notification.sender.profile.avatar.url}
                            alt={senderName || "Sender"}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10 transition-all duration-300 hover:scale-110 hover:ring-brand-green/40"
                          />
                        </Link>
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/6 ring-1 ring-white/5">
                          <Bell size={13} className="text-white/30" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-[11px] font-semibold text-white/70">
                            {senderName || "System"}
                          </p>

                          <span className="shrink-0 text-[10px] text-white/25">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>

                        <p
                          className={`mt-0.5 line-clamp-2 text-xs leading-4.5 ${
                            notification.isRead
                              ? "text-white/40"
                              : "font-medium text-white/75"
                          }`}
                        >
                          {notification.message}
                        </p>
                      </div>

                      {/* Arrow */}
                      {notification.link && (
                        <ChevronRight
                          size={14}
                          className="mt-2 shrink-0 text-white/15 transition group-hover:translate-x-0.5 group-hover:text-brand-green"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center px-6 py-10 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/4 ring-1 ring-white/5">
                  <CheckCircle2 size={18} className="text-brand-green/50" />
                </div>

                <p className="mt-3 text-xs font-medium text-white/50">
                  No notifications
                </p>

                <p className="mt-0.5 text-[11px] text-white/25">
                  You&apos;re all caught up.
                </p>
              </div>
            )}

            {/* View All */}
            {hasMoreNotifications && (
              <div className="relative border-t border-white/6 p-2">
                <Link
                  href="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 items-center justify-center gap-1 rounded-lg text-[11px] font-medium text-white/45 transition hover:bg-brand-green/10 hover:text-brand-green"
                >
                  View all
                  <ChevronRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}