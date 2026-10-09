"use client";

import React from "react";
import { formatCurrency } from "../utils/helpers";
import { ArrowDownToLine, Loader2 } from "lucide-react";

interface WithdrawalProps {
  balance: number;
  loading: {
    withdrawing: boolean;
    global: boolean;
  };
  setWithdrawalModalOpen: (open: boolean) => void;
}

export default function Withdrawal({
  balance,
  loading,
  setWithdrawalModalOpen,
}: WithdrawalProps) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-bold text-white">Withdraw Funds</h3>

          <p className="mt-1 text-sm text-white/35">
            Withdraw available funds from the platform wallet.
          </p>
        </div>

        <button
          type="button"
          disabled={balance <= 0 || loading.withdrawing || loading.global}
          onClick={() => setWithdrawalModalOpen(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-green px-4 text-xs font-bold text-brand-navy transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading.withdrawing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowDownToLine className="h-4 w-4" />
          )}

          {loading.withdrawing ? "Processing..." : "Withdraw"}
        </button>
      </div>

      <div className="mt-5 border-t border-white/6 pt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/35">Available for withdrawal</span>

          <span className="font-semibold text-brand-green">
            {formatCurrency(balance)}
          </span>
        </div>
      </div>
    </div>
  );
}
