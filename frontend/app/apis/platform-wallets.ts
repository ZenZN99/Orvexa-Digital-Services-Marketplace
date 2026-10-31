import { request } from "./request";

export const platformWalletsApi = {
  findBalance: async () => request("/api/platform-wallets"),

  withdraw: async (amount: number) =>
    request("/api/platform-wallets", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
};
