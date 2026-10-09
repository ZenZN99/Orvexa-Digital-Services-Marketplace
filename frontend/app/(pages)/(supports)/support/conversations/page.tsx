"use client";

import { useEffect, useMemo, useState } from "react";
import { useSupportConversations } from "@/app/hooks/useSupportConversations";
import { SupportConversationStatus } from "@/app/types/support-conversation";
import Header from "./components/Header";
import Stats from "./components/Stats";
import Toolbar from "./components/Toolbar";
import List from "./components/List";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
import Skeleton from "./components/Skeleton";

export default function ConversationsPage() {
  const { myConversations, fetchMyConversation, createConversation, loading } =
    useSupportConversations();

  const [loadingPage, setLoadingPage] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | SupportConversationStatus>(
    "all",
  );

  useEffect(() => {
    fetchMyConversation().finally(() => setLoadingPage(false));
  }, []);

  const openCount = myConversations.filter(
    (c) => c.status === SupportConversationStatus.OPEN,
  ).length;

  const closedCount = myConversations.filter(
    (c) => c.status === SupportConversationStatus.CLOSED,
  ).length;

  const hasOpenConversation = openCount > 0;

  const filtered = useMemo(() => {
    return myConversations
      .filter((c) => filter === "all" || c.status === filter)
      .filter((c) =>
        search.trim()
          ? c.lastMessage?.toLowerCase().includes(search.toLowerCase())
          : true,
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime(),
      );
  }, [myConversations, filter, search]);

  const handleStart = async () => {
    const result = await createConversation();
    if (result) await fetchMyConversation();
  };

  if (loadingPage) {
    return <Skeleton />;
  }

  return (
    <ProtectedRoute roles={[UserRole.CLIENT, UserRole.FREELANCER]}>
      <main className="min-h-screen bg-brand-navy px-5 pb-20 pt-28 text-white sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <Header
            myConversations={myConversations}
            handleStart={handleStart}
            creating={loading.creating}
            hasOpenConversation={hasOpenConversation}
          />

          <Stats
            myConversations={myConversations}
            openCount={openCount}
            closedCount={closedCount}
          />

          <Toolbar
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />

          <List filtered={filtered} myConversations={myConversations} />
        </div>
      </main>
    </ProtectedRoute>
  );
}
