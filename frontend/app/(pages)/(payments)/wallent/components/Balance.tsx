"use client";

import { LockKeyhole, Wallet } from "lucide-react";

interface BalanceProps {
  totalBalance: number;
  balance: number;
  frozenBalance: number;
}

export default function Balance({
  totalBalance,
  balance,
  frozenBalance,
}: BalanceProps) {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-white/[0.07] bg-white/2.5">
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/30">
              Total Balance
            </p>

            <p className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              ${totalBalance.toFixed(2)}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
            <Wallet size={22} />
          </div>
        </div>

        <div className="mt-8 h-px bg-white/6" />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Available */}
          <div className="rounded-2xl border border-white/6 bg-white/2 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                <Wallet size={17} />
              </div>

              <div>
                <p className="text-xs text-white/35">Available Balance</p>

                <p className="mt-1 text-xl font-bold text-white">
                  ${balance.toFixed(2)}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-white/25">
              Funds available for purchases and other wallet operations.
            </p>
          </div>

          {/* Frozen */}
          <div className="rounded-2xl border border-white/6 bg-white/2 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                <LockKeyhole size={17} />
              </div>

              <div>
                <p className="text-xs text-white/35">Frozen Balance</p>

                <p className="mt-1 text-xl font-bold text-white">
                  ${frozenBalance.toFixed(2)}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-white/25">
              Funds temporarily held for active orders or pending transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
