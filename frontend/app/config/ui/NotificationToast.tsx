"use client";

import { Toast, toast as toastApi } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { X, UserRound } from "lucide-react";
import { INotification } from "@/app/types/notification";

interface NotificationToastProps {
  t: Toast;
  notification: INotification;
}

export default function NotificationToast({
  t,
  notification,
}: NotificationToastProps) {
  const router = useRouter();

  const sender = notification.sender;
  const avatarUrl = sender?.profile?.avatar?.url;
  const senderName = sender
    ? `${sender.firstName} ${sender.lastName}`
    : "Orvexa";

  const handleClick = () => {
    toastApi.dismiss(t.id);

    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`pointer-events-auto flex w-full max-w-sm cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-[#0f1b2d] p-4 shadow-lg shadow-black/40 transition-all duration-200 hover:border-brand-green/30 ${
        t.visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
    >
      {/* Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={senderName}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound size={18} className="text-white/40" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {senderName}
        </p>

        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-white/60">
          {notification.message}
        </p>
      </div>

      {/* Dismiss */}
      <button
        onClick={(event) => {
          event.stopPropagation();
          toastApi.dismiss(t.id);
        }}
        className="shrink-0 text-white/30 transition hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}