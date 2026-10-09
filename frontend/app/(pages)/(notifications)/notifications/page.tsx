"use client";

import { Loader2 } from "lucide-react";
import { useNotifications } from "@/app/hooks/useNotifications";
import Header from "./components/Header";
import Stats from "./components/Stats";
import Notifications from "./components/Notifications";
import EmptyState from "./components/EmptyState";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";

export default function NotificationsPage() {
  const {
    myNotifications: notificationsData,
    loading,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useNotifications();

  const myNotifications = notificationsData ?? [];

  const unreadCount = myNotifications.filter(
    (notification) => !notification.isRead,
  ).length;

  if (loading.global) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-navy text-white">
        <Loader2 size={26} className="animate-spin text-brand-green" />
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-brand-navy px-6 py-28 text-white">
        <div className="mx-auto max-w-4xl">
          <Header
            unreadCount={unreadCount}
            markAllNotificationsAsRead={markAllNotificationsAsRead}
            loading={loading}
          />

          <Stats myNotifications={myNotifications} unreadCount={unreadCount} />

          {myNotifications.length > 0 ? (
            <Notifications
              myNotifications={myNotifications}
              loading={loading}
              markNotificationAsRead={markNotificationAsRead}
              deleteNotification={deleteNotification}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
