"use client";

import { useEffect, useMemo, useState } from "react";
import { useSupportConversations } from "@/app/hooks/useSupportConversations";
import { SupportConversationStatus } from "@/app/types/support-conversation";
import { StatusFilter } from "@/app/admin/support/SupportManagement/SupportManagement";
import Header from "./components/Header";
import Stats from "./components/Stats";
import Toolbar from "./components/Toolbar";
import List from "./components/List";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
import Skeleton from "./components/Skeleton";

export default function SupportConversations() {
  const { conversations, fetchConversations, loading } =
    useSupportConversations();

  const [hasLoaded, setHasLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    fetchConversations().finally(() => setHasLoaded(true));
  }, []);

  const stats = useMemo(() => {
    const total = conversations.length;
    const open = conversations.filter(
      (c) => c.status === SupportConversationStatus.OPEN,
    ).length;
    const closed = conversations.filter(
      (c) => c.status === SupportConversationStatus.CLOSED,
    ).length;

    return { total, open, closed };
  }, [conversations]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return conversations
      .filter((c) => filter === "all" || c.status === filter)
      .filter((c) => {
        if (!normalizedSearch) return true;

        const userName = c.user ? `${c.user.firstName} ${c.user.lastName}` : "";

        return (
          c.id.toLowerCase().includes(normalizedSearch) ||
          userName.toLowerCase().includes(normalizedSearch) ||
          c.lastMessage?.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime(),
      );
  }, [conversations, search, filter]);

  if (!hasLoaded) {
    return <Skeleton />;
  }

  return (
    <ProtectedRoute roles={[UserRole.ADMIN, UserRole.SUPPORT]}>
      <main className="pt-28 min-h-screen bg-brand-navy px-5 pb-20  text-white sm:px-8">
        <div className="mx-auto max-w-4xl">
          <Header />

          <Stats stats={stats} />

          <Toolbar
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />

          <List filtered={filtered} />
        </div>
      </main>
    </ProtectedRoute>
  );
}
