"use client";

import { IPayment } from "@/app/types/payment";
import React from "react";
import { PaymentFilter } from "../PaymentsManagement";

interface ResultSummaryProps {
  filteredPayments: IPayment[];
  payments: IPayment[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
  search: string;
  setSearch: (e: string) => void;
  statusFilter: PaymentFilter;
  setStatusFilter: (s: PaymentFilter) => void;
}

export default function ResultSummary({
  filteredPayments,
  payments,
  pagination,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: ResultSummaryProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs text-white/30">
        Showing <span className="text-white/55">{filteredPayments.length}</span>{" "}
        of <span className="text-white/55">{payments.length}</span> payments
        {pagination.total > payments.length && (
          <>
            {" "}
            (page {pagination.page} of {pagination.totalPages},{" "}
            {pagination.total} total)
          </>
        )}
      </p>

      {search || statusFilter !== "all" ? (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
          }}
          className="text-xs text-white/35 transition hover:text-white/65"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
