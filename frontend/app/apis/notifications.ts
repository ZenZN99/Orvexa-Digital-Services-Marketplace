import { request } from "./request";

export const notificationsApi = {
  findMe: async () => request("/api/notifications/me"),

  markAsRead: async (notificationId: string) =>
    request(`/api/notifications/${notificationId}/read`, {
      method: "PATCH",
    }),

  markAllAsRead: async () =>
    request("/api/notifications/read-all", {
      method: "PUT",
    }),

  destroy: async (notificationId: string) =>
    request(`/api/notifications/${notificationId}`, {
      method: "DELETE",
    }),
};
