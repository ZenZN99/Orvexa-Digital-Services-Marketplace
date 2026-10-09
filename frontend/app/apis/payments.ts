import { request } from "./request";

export const paymentsApi = {
  pay: async (orderId: string) =>
    request(`/api/payments/${orderId}`, {
      method: "POST",
    }),

  findAll: async (page = 1, limit = 10) =>
    request(`/api/payments?page=${page}&limit=${limit}`),

  findMe: async () => request("/api/payments/me"),

  findOne: async (paymentId: string) => request(`/api/payments/${paymentId}`),

  rechargeBalance: async (amount: number) => {
    return request("/api/payments/recharge-balance", {
      method: "PATCH",
      body: JSON.stringify({ amount }),
    });
  },
};
