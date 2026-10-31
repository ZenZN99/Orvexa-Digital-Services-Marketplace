"use client";

import { create } from "zustand";
import { createElement } from "react";
import toast from "react-hot-toast";

import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "@/app/config/socket/socket";

import { INotification, NotificationStore } from "@/app/types/notification";
import NotificationToast from "../config/ui/NotificationToast";

// ========================
// NOTIFICATION SOUND
// الملف لازم يكون هنا: public/notification.mp3
// ========================
let notificationAudio: HTMLAudioElement | null = null;

const playNotificationSound = () => {
  if (typeof window === "undefined") return;

  try {
    if (!notificationAudio) {
      notificationAudio = new Audio("/notification.mp3");
      notificationAudio.volume = 1;
    }

    notificationAudio.currentTime = 0;
    notificationAudio.play().catch(() => {
      // المتصفح منع التشغيل التلقائي (لسا ما صار تفاعل من المستخدم)
    });
  } catch {
    // تجاهل أي خطأ
  }
};

export const useNotificationStore = create<NotificationStore>((set) => {
  let listenersInitialized = false;

  const updateUnreadCount = (notifications: INotification[]) => {
    return notifications.filter((notification) => !notification.isRead).length;
  };

  const initializeListeners = () => {
    if (listenersInitialized) return;

    const socket = getSocket();

    socket.on("receive-notification", (notification: INotification) => {
      let isNew = false;

      set((state) => {
        const exists = state.notifications.some(
          (item) => item.id === notification.id,
        );

        if (exists) {
          return state;
        }

        isNew = true;

        const notifications = [notification, ...state.notifications];

        return {
          notifications,
          unreadCount: updateUnreadCount(notifications),
        };
      });

      // إشعار مكرر: لا صوت ولا toast
      if (!isNew) return;

      // 🔔 تشغيل الصوت
      playNotificationSound();

      // Custom styled toast (sender avatar + message) instead of a plain success/error toast.
      toast.custom(
        (t) => createElement(NotificationToast, { t, notification }),
        {
          duration: 5000,
          position: "top-right",
        },
      );
    });

    socket.on(
      "notification-read",
      ({ notificationId }: { notificationId: string }) => {
        set((state) => {
          const notifications = state.notifications.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  isRead: true,
                }
              : notification,
          );

          return {
            notifications,
            unreadCount: updateUnreadCount(notifications),
          };
        });
      },
    );

    socket.on("notifications-marked-as-read", () => {
      set((state) => {
        const notifications = state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }));

        return {
          notifications,
          unreadCount: 0,
        };
      });
    });

    socket.on("connect", () => {
      set({
        isConnected: true,
      });
    });

    socket.on("disconnect", () => {
      set({
        isConnected: false,
      });
    });

    listenersInitialized = true;
  };

  return {
    notifications: [],
    unreadCount: 0,
    isConnected: false,

    connect: () => {
      const socket = connectSocket();

      initializeListeners();

      if (socket.connected) {
        set({
          isConnected: true,
        });
      }
    },

    disconnect: () => {
      disconnectSocket();

      listenersInitialized = false;

      set({
        isConnected: false,
      });
    },

    addNotification: (notification) => {
      set((state) => {
        const exists = state.notifications.some(
          (item) => item.id === notification.id,
        );

        if (exists) {
          return state;
        }

        const notifications = [notification, ...state.notifications];

        return {
          notifications,
          unreadCount: updateUnreadCount(notifications),
        };
      });
    },

    markAsRead: (notificationId) => {
      set((state) => {
        const notifications = state.notifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        );

        return {
          notifications,
          unreadCount: updateUnreadCount(notifications),
        };
      });
    },

    markAllAsRead: () => {
      set((state) => {
        const notifications = state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }));

        return {
          notifications,
          unreadCount: 0,
        };
      });
    },

    setNotifications: (notifications) => {
      set({
        notifications,
        unreadCount: updateUnreadCount(notifications),
      });
    },

    clearNotifications: () => {
      set({
        notifications: [],
        unreadCount: 0,
      });
    },
  };
});
