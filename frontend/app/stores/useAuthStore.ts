import { create } from "zustand";
import { UserStore } from "@/app/types/user";
import { authApi } from "../apis/auth";

export const useAuthStore = create<UserStore>((set) => ({
  currentUser: null,
  isLoading: false,
  isInitialized: false,

  setUser: (currentUser) => set({ currentUser }),

  loadUser: async () => {
    set({ isLoading: true, isInitialized: true });

    try {
      const response = await authApi.me();

      set({
        currentUser: response.data,
      });
    } catch (error) {
      set({ currentUser: null });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      set({ currentUser: null, isLoading: false });
    }
  },
}));
