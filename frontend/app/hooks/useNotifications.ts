"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { notificationsApi } from "../apis/notifications";
import { INotification } from "../types/notification";
import { useNotificationStore } from "../stores/useNotificationStore";

interface LoadingState {
  global: boolean;
  markingAsRead: Record<string, boolean>;
  markingAllAsRead: boolean;
  deleting: Record<string, boolean>;
}

export const useNotifications = () => {
  const [myNotifications, setMyNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    global: false,
    markingAsRead: {},
    markingAllAsRead: false,
    deleting: {},
  });

  // STORE
  const setStoreNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );
  const markStoreAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllStoreAsRead = useNotificationStore(
    (state) => state.markAllAsRead,
  );

  const fetchNotifications = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await notificationsApi.findMe();

      const list = Array.isArray(res.data) ? res.data : [];

      setMyNotifications(list);

      setStoreNotifications(list); // STORE

      return res.data;
    } catch {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, [setStoreNotifications]); // STORE

  const markNotificationAsRead = async (notificationId: string) => {
    const snapshot = myNotifications;

    setLoading((p) => ({
      ...p,
      markingAsRead: {
        ...p.markingAsRead,
        [notificationId]: true,
      },
    }));

    setMyNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      ),
    );

    markStoreAsRead(notificationId); // STORE

    try {
      const res = await notificationsApi.markAsRead(notificationId);

      return res.data;
    } catch (error: any) {
      setMyNotifications(snapshot);

      setStoreNotifications(snapshot); // STORE (rollback)

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to mark notification as read",
      );

      return null;
    } finally {
      setLoading((p) => {
        const { [notificationId]: _, ...rest } = p.markingAsRead;

        return {
          ...p,
          markingAsRead: rest,
        };
      });
    }
  };

  // ========================
  // MARK ALL NOTIFICATIONS AS READ
  // ========================
  const markAllNotificationsAsRead = async () => {
    const snapshot = myNotifications;

    setLoading((p) => ({
      ...p,
      markingAllAsRead: true,
    }));

    setMyNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    );

    markAllStoreAsRead(); // STORE

    try {
      const res = await notificationsApi.markAllAsRead();

      return res.data;
    } catch (error: any) {
      setMyNotifications(snapshot);

      setStoreNotifications(snapshot); // STORE (rollback)

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to mark all notifications as read",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        markingAllAsRead: false,
      }));
    }
  };

  // ========================
  // DELETE NOTIFICATION
  // ========================
  const deleteNotification = async (notificationId: string) => {
    const snapshot = myNotifications;

    setLoading((p) => ({
      ...p,
      deleting: {
        ...p.deleting,
        [notificationId]: true,
      },
    }));

    setMyNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );

    // STORE (الـ store ما عنده delete، فبنستخدم setNotifications)
    setStoreNotifications(
      useNotificationStore
        .getState()
        .notifications.filter((notification) => notification.id !== notificationId),
    );

    try {
      const res = await notificationsApi.destroy(notificationId);

      toast.success("Notification deleted successfully");

      return res.data;
    } catch (error: any) {
      setMyNotifications(snapshot);

      setStoreNotifications(snapshot); // STORE (rollback)

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete notification",
      );

      return null;
    } finally {
      setLoading((p) => {
        const { [notificationId]: _, ...rest } = p.deleting;

        return {
          ...p,
          deleting: rest,
        };
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const refresh = () => {
    fetchNotifications();
  };

  return {
    // data
    myNotifications,

    // loading
    loading,

    // fetch
    fetchNotifications,
    refresh,

    // actions
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  };
};