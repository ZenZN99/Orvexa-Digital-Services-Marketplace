"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePayments } from "@/app/hooks/usePayments";
import { statusConfig } from "../../payments/utils/helpers";
import Back from "./components/Back";
import Header from "./components/Header";
import Left from "./components/Left";
import Right from "./components/Right";
import Bottom from "./components/Bottom";
import NotFound from "./components/NotFound";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
import Skeleton from "./components/Skeleton";

export default function PaymentDetailsPage() {
  const params = useParams<{ id: string }>();
  const { payment, fetchPaymentById } = usePayments();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    setLoading(true);
    setNotFound(false);

    fetchPaymentById(params.id)
      .then((res) => {
        if (!res) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <Skeleton />;
  }

  if (notFound || !payment) {
    return <NotFound />;
  }

  const status = statusConfig[payment.status];
  const StatusIcon = status.icon;

  return (
    <ProtectedRoute roles={[UserRole.CLIENT]}>
      <main className="min-h-screen bg-brand-navy px-5 py-28 text-white sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Back />

          <Header payment={payment} status={status} StatusIcon={StatusIcon} />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <Left payment={payment} status={status} StatusIcon={StatusIcon} />

            <Right payment={payment} status={status} StatusIcon={StatusIcon} />
          </div>

          <Bottom payment={payment} />
        </div>
      </main>
    </ProtectedRoute>
  );
}
