"use client";

import Link from "next/link";
import {
  defaultConfig,
  formatTime,
  formatType,
  notificationConfig,
} from "../utils/helpers";
import { INotification } from "@/app/types/notification";
import { Loader2, Trash2, UserRound } from "lucide-react";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

interface NotificationsProps {
  myNotifications: INotification[];
  loading: {
    markingAsRead: Record<string, boolean>;
    deleting: Record<string, boolean>;
  };
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

export default function Notifications({
  myNotifications,
  loading,
  markNotificationAsRead,
  deleteNotification,
}: NotificationsProps) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2.5">
      <div className="divide-y divide-white/5">
        {myNotifications.map((notification) => {
          const config = notificationConfig[notification.type] ?? defaultConfig;

          const Icon = config.icon;

          const isMarkingAsRead = !!loading.markingAsRead?.[notification.id];

          const isDeleting = !!loading.deleting?.[notification.id];

          const senderName = [
            notification.sender?.firstName,
            notification.sender?.lastName,
          ]
            .filter(Boolean)
            .join(" ");

          const isOnline = notification.sender
            ? onlineUserIds.includes(notification.sender.id)
            : false;

          const handleMarkAsRead = () => {
            if (!notification.isRead && !isMarkingAsRead) {
              markNotificationAsRead(notification.id);
            }
          };

          return (
            <div
              key={notification.id}
              onClick={handleMarkAsRead}
              className={`group relative flex gap-3 p-4 sm:gap-4 sm:p-5 transition ${
                notification.isRead
                  ? "hover:bg-white/2"
                  : "cursor-pointer bg-brand-green/2.5 hover:bg-brand-green/4"
              }`}
            >
              {/* Unread indicator */}
              {!notification.isRead && (
                <span className="absolute left-0 top-0 h-full w-0.5 bg-brand-green" />
              )}

              {/* Icon */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${config.bgClass} ${config.iconClass}`}
              >
                <Icon size={18} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0 flex-1">
                    {/* Sender */}
                    <div className="mb-3 flex items-center gap-2.5">
                      <div className="group/avatar relative h-7 w-7 shrink-0">
                        {notification.sender?.profile?.avatar?.url ? (
                          <img
                            src={notification.sender.profile.avatar.url}
                            alt={senderName || "Sender"}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/6">
                            <UserRound size={13} className="text-white/30" />
                          </div>
                        )}

                        {isOnline && (
                          <>
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_8px_rgba(0,220,130,0.45)]" />

                            <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
                              Online
                            </span>
                          </>
                        )}
                      </div>

                      <span className="truncate text-xs font-medium text-white/55">
                        {senderName || "System"}
                      </span>
                    </div>

                    {/* Message */}
                    <div className="flex items-start gap-2">
                      <p
                        className={`wrap-break-word text-sm leading-6 ${
                          notification.isRead
                            ? "font-medium text-white/70"
                            : "font-semibold text-white"
                        }`}
                      >
                        {notification.message}
                      </p>

                      {!notification.isRead && (
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                      )}
                    </div>

                    {/* Meta */}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/25">
                      <span>{formatTime(notification.createdAt)}</span>

                      <span>•</span>

                      <span>{formatType(notification.type)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                    {/* View */}
                    {notification.link && (
                      <Link
                        href={notification.link}
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        className="inline-flex h-8 items-center rounded-lg border border-white/8 bg-white/3 px-3 text-xs font-medium text-white/50 transition hover:border-brand-green/20 hover:bg-brand-green/10 hover:text-brand-green"
                      >
                        View
                      </Link>
                    )}

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      disabled={isDeleting}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/20 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                      aria-label="Delete notification"
                    >
                      {isDeleting ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
