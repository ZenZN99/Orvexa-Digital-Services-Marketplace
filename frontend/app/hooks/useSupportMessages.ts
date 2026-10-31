"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supportMessagesApi } from "../apis/support-messages";
import { ISupportMessage } from "../types/support-message";

interface LoadingState {
  global: boolean;
  creating: boolean;
  markingAsRead: boolean;
  deleting: Record<string, boolean>;
}

export const useSupportMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<ISupportMessage[]>([]);

  const [loading, setLoading] = useState<LoadingState>({
    global: false,
    creating: false,
    markingAsRead: false,
    deleting: {},
  });

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      return [];
    }

    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await supportMessagesApi.findAll(conversationId);

      setMessages(Array.isArray(res.data) ? res.data : []);

      return res.data;
    } catch {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, [conversationId]);

  const createMessage = async (message?: string, attachments?: File[]) => {
    setLoading((p) => ({
      ...p,
      creating: true,
    }));

    try {
      const res = await supportMessagesApi.create(
        conversationId,
        message,
        attachments,
      );

      toast.success("Message sent successfully");

      await fetchMessages();

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send message",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        creating: false,
      }));
    }
  };

  const markAllAsRead = async () => {
    setLoading((p) => ({
      ...p,
      markingAsRead: true,
    }));

    try {
      const res = await supportMessagesApi.markAllAsRead(conversationId);

      toast.success("Messages marked as read");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to mark messages as read",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        markingAsRead: false,
      }));
    }
  };

  const deleteMessage = async (messageId: string) => {
    const snapshot = messages;

    setLoading((p) => ({
      ...p,
      deleting: {
        ...p.deleting,
        [messageId]: true,
      },
    }));

    setMessages((prev) => prev.filter((message) => message.id !== messageId));

    try {
      await supportMessagesApi.destroy(conversationId, messageId);

      toast.success("Message deleted successfully");
    } catch (error: any) {
      setMessages(snapshot);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete message",
      );
    } finally {
      setLoading((p) => {
        const { [messageId]: _, ...rest } = p.deleting;

        return {
          ...p,
          deleting: rest,
        };
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const refresh = () => {
    fetchMessages();
  };

  return {
    // data
    messages,

    // loading
    loading,

    // fetch
    fetchMessages,
    refresh,

    // actions
    createMessage,
    markAllAsRead,
    deleteMessage,
  };
};
