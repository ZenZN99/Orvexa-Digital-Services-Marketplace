import { request } from "./request";

export const cartsApi = {
  findMe: async () => request("/api/carts/me"),

  addItem: async (serviceId: string) =>
    request(`/api/carts/${serviceId}`, {
      method: "POST",
    }),

  removeItem: async (serviceId: string) =>
    request(`/api/carts/${serviceId}`, {
      method: "DELETE",
    }),

  clearCart: async () =>
    request("/api/carts", {
      method: "DELETE",
    }),
};
