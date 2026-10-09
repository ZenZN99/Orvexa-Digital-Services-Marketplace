"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { messagesApi } from "../apis/messages";
import { IMessage } from "../types/message";
import { useMessageStore } from "../stores/useMessageStore";

interface LoadingState {
  global: boolean;
  deleting: Record<string, boolean>;
  creating: boolean;
}

export const useMessages = (
  initialPage: number = 1,
  limit: number = 10,
  contractId?: string,
) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [myMessages, setMyMessages] = useState<IMessage[]>([]);

  const [page, setPage] = useState(initialPage);

  const [pagination, setPagination] = useState({
    page: initialPage,
    limit,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState<LoadingState>({
    global: false,
    deleting: {},
    creating: false,
  });

  // STORE
  const setStoreMessages = useMessageStore((state) => state.setMessages);
  const deleteStoreMessage = useMessageStore((state) => state.deleteMessage);

  const fetchMessages = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await messagesApi.findAll(page, limit);

      setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);

      setPagination(res.data.pagination);

      return res.data.messages;
    } catch {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, [page, limit]);

  const fetchMyMessages = useCallback(async () => {
    if (!contractId) {
      return [];
    }

    try {
      const res = await messagesApi.findMe(contractId);

      const list = Array.isArray(res.data) ? res.data : [];

      setMyMessages(list);

      setStoreMessages(list); // STORE

      return res.data;
    } catch {
      return [];
    }
  }, [contractId, setStoreMessages]); // STORE

  const createMessage = async (
    contractId: string,
    content?: string,
    images?: File[],
  ) => {
    setLoading((p) => ({
      ...p,
      creating: true,
    }));

    try {
      const res = await messagesApi.create(contractId, content, images);

      toast.success("Message sent successfully");

      await fetchMyMessages(); // بيزامن الـ store تلقائياً

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

  const deleteMessage = async (messageId: string) => {
    const snapshot = myMessages;

    setLoading((p) => ({
      ...p,
      deleting: {
        ...p.deleting,
        [messageId]: true,
      },
    }));

    setMyMessages((prev) => prev.filter((message) => message.id !== messageId));

    deleteStoreMessage(messageId); // STORE

    try {
      const res = await messagesApi.destroy(messageId);

      toast.success("Message deleted successfully");

      return res.data;
    } catch (error: any) {
      setMessages(snapshot);

      setStoreMessages(snapshot); // STORE (rollback)

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete message",
      );

      return null;
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

  useEffect(() => {
    fetchMyMessages();
  }, [fetchMyMessages]);

  const refresh = () => {
    fetchMessages();

    if (contractId) {
      fetchMyMessages();
    }
  };

  return {
    // data
    messages,
    myMessages,

    pagination,
    page,
    setPage,

    // loading
    loading,

    // fetch
    fetchMessages,
    fetchMyMessages,
    refresh,

    // actions
    createMessage,
    deleteMessage,
  };
};
