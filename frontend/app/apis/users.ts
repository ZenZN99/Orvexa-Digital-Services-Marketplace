import { UserRole } from "../types/user";
import { request } from "./request";

export const usersApi = {
  findAll: async (page = 1, limit = 10) => {
    return request(`/api/users?page=${page}&limit=${limit}`);
  },

  findOne: async (userId: string) => {
    return request(`/api/users/${userId}`);
  },

  updateRole: async (userId: string, role: UserRole) => {
    return request(`/api/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },

  block: async (userId: string) => {
    return request(`/api/users/${userId}`, {
      method: "DELETE",
    });
  },
};
