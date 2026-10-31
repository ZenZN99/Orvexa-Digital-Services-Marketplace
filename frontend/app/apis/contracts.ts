import { request } from "./request";

export const contractsApi = {
  findMe: async () => request("/api/contracts/me"),

  findAll: async (page = 1, limit = 10) =>
    request(`/api/contracts?page=${page}&limit=${limit}`),

  findOne: async (contractId: string) =>
    request(`/api/contracts/${contractId}`),

  complete: async (contractId: string) =>
    request(`/api/contracts/complete/${contractId}`, {
      method: "POST",
    }),

  deliver: async (contractId: string) =>
    request(`/api/contracts/deliver/${contractId}`, {
      method: "POST",
    }),
};
