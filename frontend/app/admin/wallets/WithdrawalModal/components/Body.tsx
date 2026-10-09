"use client";

import {
  formatCurrency,
  QUICK_PERCENTAGES,
} from "../../PlatformWallet/utils/helpers";

interface BodyProps {
  balance: number;
  amount: string;
  loading: boolean;
  error: string | null;
  numericAmount: number;
  remaining: number;
  isValidNumber: boolean;
  handleAmountChange: (value: string) => void;
  handleQuickAmount: (percentage: number) => void;
  handleSubmit: () => void;
}

export default function Body({
  balance,
  amount,
  loading,
  error,
  numericAmount,
  remaining,
  isValidNumber,
  handleAmountChange,
  handleQuickAmount,
  handleSubmit,
}: BodyProps) {
  return (
    <div className="relative space-y-5 px-6 py-6">
      {/* Available balance */}
      <div className="rounded-xl border border-brand-green/15 bg-brand-green/6 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-white/40">
          Available Balance
        </p>

        <p className="mt-2 text-2xl font-bold text-brand-green">
          {formatCurrency(balance)}
        </p>
      </div>

      {/* Amount */}
      <div>
        <label
          htmlFor="withdrawal-amount"
          className="text-sm font-semibold text-white"
        >
          Withdrawal Amount
        </label>

        <div className="relative mt-2">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-white/35">
            $
          </span>

          <input
            id="withdrawal-amount"
            type="number"
            inputMode="decimal"
            min="0"
            max={balance}
            step="0.01"
            value={amount}
            onChange={(event) => handleAmountChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !loading) handleSubmit();
            }}
            disabled={loading}
            placeholder="0.00"
            autoFocus
            className={`h-12 w-full rounded-xl border bg-white/3 pl-8 pr-4 text-sm font-medium text-white outline-none transition    disabled:cursor-not-allowed disabled:opacity-50 ${
              error ? "border-red-400/50" : "border-white/10"
            }`}
          />
        </div>

        {/* Quick amounts */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {QUICK_PERCENTAGES.map((percentage) => (
            <button
              key={percentage}
              type="button"
              disabled={loading || balance <= 0}
              onClick={() => handleQuickAmount(percentage)}
              className="h-8 rounded-lg border border-white/8 bg-white/3 text-xs font-semibold text-white/50 transition hover:border-brand-green/30 hover:bg-brand-green/10 hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-40"
            >
              {percentage === 100 ? "Max" : `${percentage}%`}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-3 text-xs font-medium text-red-400">{error}</p>
        )}
      </div>

      {/* Summary */}
      <div className="space-y-2 rounded-xl border border-white/[0.07] bg-white/2.5 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/35">Withdrawing</span>

          <span className="font-semibold text-white">
            {isValidNumber && numericAmount > 0
              ? formatCurrency(numericAmount)
              : "—"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/35">Remaining balance</span>

          <span
            className={`font-semibold ${
              remaining < 0 ? "text-red-400" : "text-white"
            }`}
          >
            {formatCurrency(remaining)}
          </span>
        </div>
      </div>
    </div>
  );
}
