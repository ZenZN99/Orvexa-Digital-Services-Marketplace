"use client";

import { create } from "zustand";

import { connectSocket, getSocket } from "@/app/config/socket/socket";

interface PresenceStore {
  onlineUserIds: string[];
  isConnected: boolean;

  connect: () => void;
}

export const usePresenceStore = create<PresenceStore>((set) => {
  let listenersInitialized = false;

  const initializeListeners = () => {
    if (listenersInitialized) return;

    const socket = getSocket();

    socket.on("online-users", (userIds: string[]) => {
      set({
        onlineUserIds: userIds,
      });
    });

    socket.on("connect", () => {
      set({
        isConnected: true,
      });
    });

    socket.on("disconnect", () => {
      set({
        isConnected: false,
        onlineUserIds: [],
      });
    });

    listenersInitialized = true;
  };

  return {
    onlineUserIds: [],
    isConnected: false,

    connect: () => {
      const socket = connectSocket();

      initializeListeners();

      if (socket.connected) {
        set({
          isConnected: true,
        });
      }
    },
  };
});
