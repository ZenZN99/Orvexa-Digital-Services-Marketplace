"use client";

import { useEffect, useMemo, useState } from "react";
import { SupportConversationStatus } from "@/app/types/support-conversation";
import { useSupportConversations } from "@/app/hooks/useSupportConversations";
import ConversationsTable from "../ConversationsTable/ConversationsTable";
import Header from "./components/Header";
import Loading from "./components/Loading";
import Stats from "./components/Stats";
import Filters from "./components/Filters";
import ResultInfo from "./components/ResultInfo";
import SelectedConversation from "./components/SelectedConversation";

export type StatusFilter = "all" | SupportConversationStatus;

export default function SupportManagement() {
  const {
    conversations,
    fetchConversations,
    toggleConversation,
    loading,
    page,
    pagination,
    setPage,
  } = useSupportConversations();

  const [hasLoaded, setHasLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    fetchConversations().finally(() => setHasLoaded(true));
  }, []);

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId) ?? null,
    [conversations, selectedConversationId],
  );

  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const userName = conversation.user
        ? `${conversation.user.firstName} ${conversation.user.lastName}`
        : "";

      const closedByName = conversation.closedByUser
        ? `${conversation.closedByUser.firstName} ${conversation.closedByUser.lastName}`
        : "";

      const matchesSearch =
        !normalizedSearch ||
        conversation.id.toLowerCase().includes(normalizedSearch) ||
        conversation.userId.toLowerCase().includes(normalizedSearch) ||
        userName.toLowerCase().includes(normalizedSearch) ||
        conversation.lastMessage?.toLowerCase().includes(normalizedSearch) ||
        closedByName.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || conversation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [conversations, search, statusFilter]);

  const stats = useMemo(() => {
    const total = conversations.length;

    const open = conversations.filter(
      (c) => c.status === SupportConversationStatus.OPEN,
    ).length;

    const closed = conversations.filter(
      (c) => c.status === SupportConversationStatus.CLOSED,
    ).length;

    const uniqueUsers = new Set(conversations.map((c) => c.userId)).size;

    return { total, open, closed, uniqueUsers };
  }, [conversations]);

  const handleToggle = async (conversationId: string) => {
    await toggleConversation(conversationId);
  };
  if (!hasLoaded) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <Header />

      <Stats stats={stats} />

      <div className="space-y-4">
        <Filters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <ResultInfo
          filteredConversations={filteredConversations}
          conversations={conversations}
          search={search}
          statusFilter={statusFilter}
          setSearch={setSearch}
          setStatusFilter={setStatusFilter}
        />

        <ConversationsTable
          conversations={filteredConversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={(c) => setSelectedConversationId(c.id)}
          onToggleConversation={handleToggle}
          togglingIds={loading.closing}
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      </div>

      <SelectedConversation
        selectedConversation={selectedConversation}
        setSelectedConversationId={setSelectedConversationId}
        handleToggle={handleToggle}
        loading={loading}
      />
    </div>
  );
}
