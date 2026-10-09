import { authApi } from "./auth";

export let BACKEND_URL = "https://orvexa-digital-services-marketplace.onrender.com";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

let isRefreshing = false;

export const request = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<any> => {
  const isFormData = options.body instanceof FormData;

  const buildHeaders = () => ({
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  });

  const fetchRequest = () =>
    fetch(`${BACKEND_URL}${endpoint}`, {
      credentials: "include",
      ...options,
      headers: buildHeaders(),
    });

  let res = await fetchRequest();

  // Token expired
  if (res.status === 401 && endpoint !== "/api/auth/refreshToken") {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshRes = await authApi.refreshToken();

        if (refreshRes.success) {
          res = await fetchRequest();
        } else {
          throw new Error("Session expired");
        }
      } finally {
        isRefreshing = false;
      }
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};
