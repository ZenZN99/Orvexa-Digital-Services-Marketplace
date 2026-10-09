import { request } from "./request";

export const ordersApi = {
  create: async () =>
    request("/api/orders", {
      method: "POST",
    }),

  findAll: async (page = 1, limit = 10) =>
    request(`/api/orders?page=${page}&limit=${limit}`),

  findMe: async () => request("/api/orders/me"),

  findOne: async (orderId: string) => request(`/api/orders/${orderId}`),

  destroy: async (orderId: string) => {
    return request(`/api/orders/${orderId}`, {
      method: "DELETE",
    });
  },
};
