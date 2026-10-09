"use client";

import { Loader2, Wallet } from "lucide-react";
import React from "react";
import { formatCurrency, formatDate } from "../utils/helpers";

interface BalanceCardProps {
  balance: number;
  isRefreshing: boolean;
  lastSynced: Date | null;
}

export default function BalanceCard({
  balance,
  isRefreshing,
  lastSynced,
}: BalanceCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-green/15 bg-linear-to-br from-brand-green/15 via-white/3 to-transparent p-6">
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-white/55">
          <Wallet className="h-4 w-4 text-brand-green" />

          <span className="text-xs font-medium uppercase tracking-wider">
            Available Balance
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-4xl font-bold tracking-tight text-white">
            {formatCurrency(balance)}
          </span>

          {isRefreshing && (
            <Loader2 className="h-5 w-5 animate-spin text-brand-green" />
          )}
        </div>

        <p className="mt-2 text-xs text-white/40">
          Last updated {formatDate(lastSynced)}
        </p>
      </div>

      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/10" />

      <div className="pointer-events-none absolute -bottom-20 right-20 h-48 w-48 rounded-full border border-brand-green/20" />

      <div className="pointer-events-none absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-brand-green/10 blur-3xl" />
    </div>
  );
}
