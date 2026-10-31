"use client";

import { PaymentStatus } from "@/app/types/payment";
import { useEffect, useState } from "react";
import Pagination from "@/app/shared/components/Pagination";
import { usePayments } from "@/app/hooks/usePayments";
import Header from "./components/Header";
import Stats from "./components/Stats";
import History from "./components/History";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
import Skeleton from "./components/Skeleton";

const ITEMS_PER_PAGE = 10;

export default function PaymentsPage() {
  const { myPayments, fetchMyPayments, page, setPage } = usePayments();

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    fetchMyPayments().finally(() => setHasLoaded(true));
  }, []);

  const totalPages = Math.ceil(myPayments.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;

  const payments = myPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const completedPayments = myPayments.filter(
    (payment) => payment.status === PaymentStatus.COMPLETED,
  );

  const totalSpent = myPayments
    .filter((payment) => payment.status === PaymentStatus.COMPLETED)
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  const pendingAmount = myPayments
    .filter((payment) => payment.status === PaymentStatus.PENDING)
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!hasLoaded) {
    return <Skeleton />;
  }

  return (
    <ProtectedRoute roles={[UserRole.CLIENT]}>
      <main className="min-h-screen bg-brand-navy px-5 py-28 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <Header />

          <Stats
            totalSpent={totalSpent}
            pendingAmount={pendingAmount}
            myPayments={myPayments}
          />

          <History myPayments={myPayments} payments={payments} />

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
