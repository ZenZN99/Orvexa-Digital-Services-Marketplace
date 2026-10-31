"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, Loader2, SearchX } from "lucide-react";
import { useOrders } from "@/app/hooks/useOrders";
import { statusConfig } from "../../orders/utils/statusConfig";
import Back from "./components/Back";
import Header from "./components/Header";
import Services from "./components/Services";
import Summary from "./components/Summary";
import { usePayments } from "@/app/hooks/usePayments";
import { OrderStatus } from "@/app/types/order";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
import Skeleton from "./components/Skeleton";

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const { order, fetchOrderById, loading: orderLoading } = useOrders();
  const { payOrder, loading: paymentLoading } = usePayments();

  const [notFound, setNotFound] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!params.id) return;

    setNotFound(false);

    fetchOrderById(params.id).then((res) => {
      if (!res) setNotFound(true);
    });
  }, [params.id]);

  const handleCreatePayment = async () => {
    if (!order) return;

    const result = await payOrder(order.id);

    if (result) {
      router.push("/payments");
    }
  };

  if (orderLoading.global) {
    return <Skeleton />;
  }

  if (notFound || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-navy px-4 py-28 text-white">
        <div className="flex max-w-md flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/4">
            <SearchX size={26} className="text-white/30" />
          </div>

          <h1 className="mt-5 text-lg font-semibold">Order not found</h1>

          <p className="mt-2 text-sm text-white/45">
            This order doesn't exist or doesn't belong to your account.
          </p>

          <Link
            href="/orders"
            className="mt-6 h-11 rounded-xl bg-brand-green px-5 text-sm font-semibold leading-11 text-brand-navy transition hover:opacity-90"
          >
            Back to orders
          </Link>
        </div>
      </main>
    );
  }

  const status = statusConfig[order.status];
  const services = order.services ?? [];

  const isCompleted =
    order.status === OrderStatus.IN_PROGRESS ||
    order.status === OrderStatus.COMPLETED;
  return (
    <ProtectedRoute roles={[UserRole.CLIENT]}>
      <main className="min-h-screen bg-brand-navy px-5 py-28 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Back />

          <Header order={order} status={status} />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
            <Services services={services} />

            <div className="space-y-4">
              <Summary services={services} order={order} status={status} />

              {/* Payment */}
              <div className="rounded-2xl border border-brand-green/15 bg-brand-green/4 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10">
                    <CreditCard size={18} className="text-brand-green" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {isCompleted ? "Payment completed" : "Ready to pay?"}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-white/35">
                      {isCompleted
                        ? "This order has already been paid."
                        : "Complete your payment to start the order."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreatePayment}
                  disabled={isCompleted || paymentLoading.paying}
                  className={`mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${
                    isCompleted
                      ? "cursor-not-allowed bg-white/10 text-white/30"
                      : "bg-brand-green text-brand-navy hover:brightness-110"
                  }`}
                >
                  {paymentLoading.paying ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : isCompleted ? (
                    <>
                      <CreditCard size={16} />
                      Payment Completed
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Pay Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
