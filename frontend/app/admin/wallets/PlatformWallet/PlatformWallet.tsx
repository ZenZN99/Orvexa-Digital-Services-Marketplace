"use client";

import { useEffect, useRef, useState } from "react";
import { usePlatformWallets } from "@/app/hooks/usePlatformWallets";
import WithdrawalModal from "../WithdrawalModal/WithdrawalModal";
import Header from "./components/Header";
import SyncError from "./components/SyncError";
import BalanceCard from "./components/BalanceCard";
import InfoCards from "./components/InfoCards";
import Withdrawal from "./components/Withdrawal";

export default function PlatformWallet() {
  const { balance, loading, fetchBalance, refresh, withdraw } =
    usePlatformWallets();

  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncFailed, setSyncFailed] = useState(false);

  const wasLoading = useRef(false);

  useEffect(() => {
    if (wasLoading.current && !loading.global) {
      setLastSynced(new Date());
    }

    wasLoading.current = loading.global;
  }, [loading.global]);

  const handleRefresh = async () => {
    const data = await fetchBalance();

    setSyncFailed(!data);
  };

  const handleRetry = () => {
    setSyncFailed(false);
    refresh();
  };

  const handleWithdraw = async (amount: number) => {
    const result = await withdraw(amount);

    if (result) {
      setWithdrawalModalOpen(false);
    }
  };

  const isInitialLoading = loading.global && !lastSynced;
  const isRefreshing = loading.global && !!lastSynced;

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <div className="h-40 animate-pulse rounded-2xl bg-white/4" />

        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-28 animate-pulse rounded-2xl bg-white/4" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/4" />
        </div>

        <div className="h-32 animate-pulse rounded-2xl bg-white/4" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 text-white p-10">
        <Header
          handleRefresh={handleRefresh}
          loading={loading}
          isRefreshing={isRefreshing}
        />

        <SyncError
          syncFailed={syncFailed}
          handleRetry={handleRetry}
          loading={loading}
        />

        <BalanceCard
          balance={balance}
          isRefreshing={isRefreshing}
          lastSynced={lastSynced}
        />

        <InfoCards lastSynced={lastSynced} />

        <Withdrawal
          balance={balance}
          loading={loading}
          setWithdrawalModalOpen={setWithdrawalModalOpen}
        />
      </div>

      <WithdrawalModal
        open={withdrawalModalOpen}
        balance={balance}
        loading={loading.withdrawing}
        onClose={() => {
          if (!loading.withdrawing) {
            setWithdrawalModalOpen(false);
          }
        }}
        onConfirm={handleWithdraw}
      />
    </>
  );
}
