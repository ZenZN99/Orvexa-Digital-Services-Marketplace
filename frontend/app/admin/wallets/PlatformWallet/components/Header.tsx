"use client";

import { RefreshCw } from "lucide-react";

interface HeaderProps {
  handleRefresh: () => void;
  loading: {
    global: boolean;
    withdrawing: boolean;
  };
  isRefreshing: boolean;
}

export default function Header({
  handleRefresh,
  loading,
  isRefreshing,
}: HeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
          Wallet
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
          Platform Wallet
        </h2>

        <p className="mt-1.5 text-sm text-white/35">
          Manage the platform wallet and available funds.
        </p>
      </div>

      <button
        type="button"
        onClick={handleRefresh}
        disabled={loading.global || loading.withdrawing}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 px-4 text-xs font-semibold text-white/60 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw
          className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
        />
        Refresh
      </button>
    </div>
  );
}
