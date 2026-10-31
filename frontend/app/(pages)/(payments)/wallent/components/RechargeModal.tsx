"use client";

import { ArrowDownToLine, Loader2, X } from "lucide-react";

interface RechargeLoading {
  recharging: boolean;
}

interface RechargeModalProps {
  isModalOpen: boolean;
  amount: string;
  loading: RechargeLoading;
  setAmount: (amount: string) => void;
  closeModal: () => void;
  handleRecharge: () => void;
}

export default function RechargeModal({
  isModalOpen,
  amount,
  loading,
  setAmount,
  closeModal,
  handleRecharge,
}: RechargeModalProps) {
  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-brand-navy shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/6 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Add Funds</h2>

                <p className="mt-1 text-xs text-white/30">
                  Add money to your available balance.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading.recharging}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <label className="text-xs font-medium text-white/50">
                Amount
              </label>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/30">
                  $
                </span>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="100.00"
                  disabled={loading.recharging}
                  className="h-12 w-full rounded-xl border border-white/8 bg-white/3 pl-9 pr-4 text-sm text-white outline-none transition"
                />
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading.recharging}
                  className="h-11 flex-1 rounded-xl border border-white/8 bg-white/3 text-xs font-semibold text-white/50 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleRecharge}
                  disabled={
                    loading.recharging || !amount || Number(amount) <= 0
                  }
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-green text-xs font-semibold text-brand-navy transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading.recharging ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowDownToLine size={15} />
                      Add Funds
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
