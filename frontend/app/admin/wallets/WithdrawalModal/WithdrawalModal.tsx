"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import Body from "./components/Body";
import Footer from "./components/Footer";
import SoftGlow from "./components/SoftGlow";

interface WithdrawalModalProps {
  open: boolean;
  balance: number;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void | Promise<void>;
}

export default function WithdrawalModal({
  open,
  balance,
  loading = false,
  onClose,
  onConfirm,
}: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // Reset when the modal closes
  useEffect(() => {
    if (!open) {
      setAmount("");
      setError("");
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onClose]);

  if (!open) return null;

  const numericAmount = Number(amount);
  const isValidNumber = amount.trim() !== "" && Number.isFinite(numericAmount);
  const remaining = isValidNumber ? balance - numericAmount : balance;

  const handleSubmit = () => {
    if (!amount.trim()) {
      setError("Please enter an amount.");
      return;
    }

    if (!Number.isFinite(numericAmount)) {
      setError("Please enter a valid amount.");
      return;
    }

    if (numericAmount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (numericAmount > balance) {
      setError("Insufficient wallet balance.");
      return;
    }

    setError("");
    onConfirm(Number(numericAmount.toFixed(2)));
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);

    if (error) {
      setError("");
    }
  };

  const handleQuickAmount = (percentage: number) => {
    const value = Math.floor(balance * percentage) / 100;

    setAmount(value.toFixed(2));
    setError("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/80 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="withdrawal-modal-title"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-brand-navy shadow-2xl shadow-black/50"
        onClick={(event) => event.stopPropagation()}
      >
        <SoftGlow />

        <Header onClose={onClose} loading={loading} />

        <Body
          balance={balance}
          amount={amount}
          loading={loading}
          error={error}
          numericAmount={numericAmount}
          remaining={remaining}
          isValidNumber={isValidNumber}
          handleAmountChange={handleAmountChange}
          handleQuickAmount={handleQuickAmount}
          handleSubmit={handleSubmit}
        />

        <Footer
          onClose={onClose}
          loading={loading}
          balance={balance}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
