"use client";

import { useEffect } from "react";
import { useOrders } from "@/app/hooks/useOrders";
import Header from "./components/Header";
import EmptyState from "./components/EmptyState";
import Top from "./components/Top";
import { statusConfig } from "./utils/statusConfig";
import Services from "./components/Services";
import Footer from "./components/Footer";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
import Skeleton from "./components/Skeleton";
import { useAuthStore } from "@/app/stores/useAuthStore";

export default function OrdersPage() {
  const { myOrders, fetchMyOrders, deleteOrder, loading } = useOrders();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  if (loading.global || !currentUser) {
    return <Skeleton />;
  }

  return (
    <ProtectedRoute roles={[UserRole.CLIENT]}>
      <main className="min-h-screen bg-brand-navy px-6 py-28 text-white">
        <div className="mx-auto max-w-6xl">
          <Header />

          {myOrders.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => {
                const status = statusConfig[order.status];

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-white/8 bg-white/2.5 p-5 transition hover:border-white/12"
                  >
                    <Top order={order} status={status} />

                    <Services order={order} />

                    <Footer
                      order={order}
                      onDelete={deleteOrder}
                      deleting={loading.deleting}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
