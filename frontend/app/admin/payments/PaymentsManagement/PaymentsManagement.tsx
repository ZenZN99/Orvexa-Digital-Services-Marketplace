"use client";

import { useEffect, useMemo, useState } from "react";
import { PaymentStatus } from "@/app/types/payment";
import { usePayments } from "@/app/hooks/usePayments";
import PaymentsTable from "../PaymentsTable/PaymentsTable";
import Header from "./components/Header";
import Stats from "./components/Stats";
import SecondaryStats from "./components/SecondaryStats";
import Filters from "./components/Filters";
import ResultSummary from "./components/ResultSummary";
import Loading from "@/app/(pages)/(payments)/payments/components/Loading";

export type PaymentFilter = "all" | PaymentStatus;

export default function PaymentsManagement() {
  const { payments, pagination, page, setPage, loading } = usePayments();

  const [hasLoaded, setHasLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentFilter>("all");

  useEffect(() => {
    if (!loading.global) setHasLoaded(true);
  }, [loading.global]);

  const filteredPayments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const userName = payment.user
        ? `${payment.user.firstName} ${payment.user.lastName}`
        : "";

      const matchesSearch =
        !normalizedSearch ||
        payment.id.toLowerCase().includes(normalizedSearch) ||
        payment.orderId.toLowerCase().includes(normalizedSearch) ||
        payment.userId.toLowerCase().includes(normalizedSearch) ||
        userName.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const stats = useMemo(() => {
    const completed = payments.filter(
      (payment) => payment.status === PaymentStatus.COMPLETED,
    );

    const pending = payments.filter(
      (payment) => payment.status === PaymentStatus.PENDING,
    );

    const failed = payments.filter(
      (payment) => payment.status === PaymentStatus.FAILED,
    );

    const refunded = payments.filter(
      (payment) => payment.status === PaymentStatus.REFUNDED,
    );

    return {
      total: payments.length,

      completed: completed.length,
      completedAmount: completed.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0,
      ),

      pending: pending.length,
      pendingAmount: pending.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0,
      ),

      failed: failed.length,

      refunded: refunded.length,
      refundedAmount: refunded.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0,
      ),
    };
  }, [payments]);

  if (!hasLoaded) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <Header />

      <Stats stats={stats} />

      <SecondaryStats payments={payments} stats={stats} />

      <Filters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <ResultSummary
        filteredPayments={filteredPayments}
        payments={payments}
        pagination={pagination}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <PaymentsTable
        payments={filteredPayments}
        page={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
