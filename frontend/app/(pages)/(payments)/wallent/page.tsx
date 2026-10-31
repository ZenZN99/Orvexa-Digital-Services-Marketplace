"use client";

import { useState } from "react";
import { usePayments } from "@/app/hooks/usePayments";
import { useAuthStore } from "@/app/stores/useAuthStore";
import Header from "./components/Header";
import Balance from "./components/Balance";
import AddFunds from "./components/AddFunds";
import RechargeModal from "./components/RechargeModal";
import Skeleton from "./components/Skeleton";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";

export default function WalletPage() {
  const { currentUser } = useAuthStore();
  const { rechargeBalance, loading } = usePayments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const balance = Number(currentUser?.balance);
  const frozenBalance = Number(currentUser?.frozenBalance);
  const totalBalance = balance + frozenBalance;

  const openModal = () => {
    setAmount("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (loading.recharging) return;

    setIsModalOpen(false);
    setAmount("");
  };

  const handleRecharge = async () => {
    const value = Number(amount);

    if (!value || value <= 0) return;

    const result = await rechargeBalance(value);

    if (result) {
      closeModal();
      window.location.reload();
    }
  };

  if (loading.global || !currentUser) {
    return <Skeleton />;
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-brand-navy px-6 py-28 text-white">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <Header currentUser={currentUser} openModal={openModal} />

          {/* Main Balance */}
          <Balance
            totalBalance={totalBalance}
            balance={balance}
            frozenBalance={frozenBalance}
          />

          {/* Add Funds */}
          <AddFunds currentUser={currentUser} openModal={openModal} />
        </div>

        {/* Recharge Modal */}
        <RechargeModal
          isModalOpen={isModalOpen}
          amount={amount}
          loading={loading}
          setAmount={setAmount}
          closeModal={closeModal}
          handleRecharge={handleRecharge}
        />
      </main>
    </ProtectedRoute>
  );
}
