import { request } from "./request";

export const supportMessagesApi = {
  create: async (
    conversationId: string,
    message?: string,
    attachments?: File[],
  ) => {
    const formData = new FormData();

    if (message) {
      formData.append("message", message);
    }

    attachments?.forEach((file) => {
      formData.append("attachments", file);
    });

    return request(`/api/support-messages/${conversationId}`, {
      method: "POST",
      body: formData,
    });
  },

  findAll: async (conversationId: string) => {
    return request(`/api/support-messages/${conversationId}`);
  },

  markAllAsRead: async (conversationId: string) => {
    return request(`/api/support-messages/${conversationId}`, {
      method: "PATCH",
    });
  },

  destroy: async (conversationId: string, messageId: string) => {
    return request(`/api/support-messages/${conversationId}/${messageId}`, {
      method: "DELETE",
    });
  },
};
