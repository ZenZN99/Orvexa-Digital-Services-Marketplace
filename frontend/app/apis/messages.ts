import { request } from "./request";

export const messagesApi = {
  create: async (contractId: string, content?: string, images?: File[]) => {
    const formData = new FormData();

    if (content) {
      formData.append("content", content);
    }

    images?.forEach((image) => {
      formData.append("images", image);
    });

    return request(`/api/messages/${contractId}`, {
      method: "POST",
      body: formData,
    });
  },

  findAll: async (page = 1, limit = 10) =>
    request(`/api/messages?page=${page}&limit=${limit}`),

  findMe: async (contractId: string) => request(`/api/messages/${contractId}`),

  destroy: async (messageId: string) =>
    request(`/api/messages/${messageId}`, {
      method: "DELETE",
    }),
};
