"use client";

import { useCarts } from "@/app/hooks/useCarts";
import Header from "./components/Header";
import EmptyState from "./components/EmptyState";
import Items from "./components/Items";
import OrderSummary from "./components/OrderSummary";
import { useOrders } from "@/app/hooks/useOrders";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
import Skeleton from "./components/Skeleton";
import { useAuthStore } from "@/app/stores/useAuthStore";

export default function CartPage() {
  const { cart, loading, removeItem, clearCart } = useCarts();
  const { createOrder, loading: orderLoading } = useOrders();
  const { currentUser } = useAuthStore();
  const router = useRouter();
  const cartItems = cart?.items ?? [];
  const total = cartItems.reduce((sum, item) => sum + item.service.price, 0);

  const handlePlaceOrder = async () => {
    const result = await createOrder();

    if (!result) return;

    router.push("/orders");
  };

  if (loading.global || !currentUser) {
    return <Skeleton />;
  }

  return (
    <ProtectedRoute roles={[UserRole.CLIENT]}>
      <main className="min-h-screen bg-brand-navy px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <Header
            cartItems={cartItems}
            clearCart={clearCart}
            loading={loading}
          />
          {cartItems.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
              <Items
                cartItems={cartItems}
                loading={loading}
                removeItem={removeItem}
              />
              <OrderSummary
                cartItems={cartItems}
                total={total}
                handlePlaceOrder={handlePlaceOrder}
                loading={orderLoading.creating}
              />
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
