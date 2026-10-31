"use client";

import { create } from "zustand";

import {
  connectSocket,
  disconnectSocket,
  getSocket,
} from "@/app/config/socket/socket";

import { IMessage, MessageStore } from "@/app/types/message";

export const useMessageStore = create<MessageStore>((set) => {
  let listenersInitialized = false;

  const initializeListeners = () => {
    if (listenersInitialized) return;

    const socket = getSocket();

    socket.on("receive-message", (message: IMessage) => {
      set((state) => {
        const exists = state.messages.some((item) => item.id === message.id);

        if (exists) {
          return state;
        }

        return {
          messages: [...state.messages, message],
        };
      });
    });

    socket.on("message-deleted", ({ messageId }: { messageId: string }) => {
      set((state) => ({
        messages: state.messages.filter((message) => message.id !== messageId),
      }));
    });

    socket.on("connect", () => {
      set({
        isConnected: true,
      });
    });

    socket.on("disconnect", () => {
      set({
        isConnected: false,
      });
    });

    listenersInitialized = true;
  };

  return {
    messages: [],
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

    disconnect: () => {
      disconnectSocket();

      listenersInitialized = false;

      set({
        isConnected: false,
      });
    },

    addMessage: (message) => {
      set((state) => {
        const exists = state.messages.some((item) => item.id === message.id);

        if (exists) {
          return state;
        }

        return {
          messages: [...state.messages, message],
        };
      });
    },

    deleteMessage: (messageId) => {
      set((state) => ({
        messages: state.messages.filter((message) => message.id !== messageId),
      }));
    },

    setMessages: (messages) => {
      set({
        messages,
      });
    },

    clearMessages: () => {
      set({
        messages: [],
      });
    },
  };
});
