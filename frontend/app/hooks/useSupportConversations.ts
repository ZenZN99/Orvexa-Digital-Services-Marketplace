"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supportConversationsApi } from "../apis/support-conversations";
import {
  ISupportConversation,
  SupportConversationStatus,
} from "../types/support-conversation";

interface LoadingState {
  global: boolean;
  conversation: boolean;
  creating: boolean;
  closing: Record<string, boolean>;
}

export const useSupportConversations = (
  initialPage: number = 1,
  limit: number = 10,
) => {
  const [conversations, setConversations] = useState<ISupportConversation[]>(
    [],
  );

  const [myConversations, setMyConversations] = useState<
    ISupportConversation[]
  >([]);

  const [conversation, setConversation] = useState<ISupportConversation | null>(
    null,
  );

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
    creating: false,
    conversation: false,
    closing: {},
  });

  const fetchConversations = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await supportConversationsApi.findAll(page, limit);

      setConversations(
        Array.isArray(res.data.conversations) ? res.data.conversations : [],
      );

      setPagination(res.data.pagination);

      return res.data.conversations;
    } catch {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, [page, limit]);

  const fetchMyConversation = async () => {
    try {
      const res = await supportConversationsApi.findMe();

      setMyConversations(res.data);

      return res.data;
    } catch {
      return null;
    }
  };

  const fetchConversationById = async (conversationId: string) => {
    setLoading((p) => ({
      ...p,
      conversation: true,
    }));

    try {
      const res = await supportConversationsApi.findOne(conversationId);

      setConversation(res.data);

      return res.data;
    } catch {
      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        conversation: false,
      }));
    }
  };
  const createConversation = async () => {
    setLoading((p) => ({
      ...p,
      creating: true,
    }));

    try {
      const res = await supportConversationsApi.create();

      setConversation(res.data);

      toast.success("Conversation created successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create conversation",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        creating: false,
      }));
    }
  };

  const toggleConversation = async (conversationId: string) => {
    const snapshot = conversations;

    setLoading((p) => ({
      ...p,
      closing: {
        ...p.closing,
        [conversationId]: true,
      },
    }));

    try {
      const res = await supportConversationsApi.toggle(conversationId);

      const updatedConversation = res.data;

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === conversationId
            ? updatedConversation
            : conversation,
        ),
      );

      toast.success(
        updatedConversation.status === SupportConversationStatus.OPEN
          ? "Conversation opened successfully"
          : "Conversation closed successfully",
      );

      return updatedConversation;
    } catch (error: any) {
      setConversations(snapshot);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update conversation",
      );

      return null;
    } finally {
      setLoading((p) => {
        const { [conversationId]: _, ...rest } = p.closing;

        return {
          ...p,
          closing: rest,
        };
      });
    }
  };
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const refresh = () => {
    fetchConversations();
  };

  return {
    // data
    conversations,
    myConversations,
    conversation,

    pagination,
    page,
    setPage,

    // loading
    loading,

    // fetch
    fetchConversations,
    fetchMyConversation,
    fetchConversationById,
    refresh,

    // actions
    createConversation,
    toggleConversation,
  };
};
