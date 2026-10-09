import { request } from "./request";

export const supportConversationsApi = {
  create: async () => {
    return request("/api/support-conversations", {
      method: "POST",
    });
  },

  findAll: async (page = 1, limit = 10) => {
    return request(`/api/support-conversations?page=${page}&limit=${limit}`);
  },

  findMe: async () => {
    return request("/api/support-conversations/me");
  },

  findOne: async (conversationId: string) => {
    return request(`/api/support-conversations/${conversationId}`);
  },

  toggle: async (conversationId: string) => {
    return request(`/api/support-conversations/${conversationId}`, {
      method: "PUT",
    });
  },
};
