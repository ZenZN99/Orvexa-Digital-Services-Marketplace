import { UserRole } from "../types/user";
import { request } from "./request";

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  login: async (data: LoginData) => {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    return request("/api/auth/logout", {
      method: "POST",
    });
  },

  me: () => {
    return request("/api/auth/me");
  },

  refreshToken: async () => {
    return request("/api/auth/refreshToken", {
      method: "POST",
    });
  },
};
