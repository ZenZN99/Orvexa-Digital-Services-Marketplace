"use client";

import { IUser, UserRole } from "@/app/types/user";
import { ArrowDownToLine } from "lucide-react";

interface AddFundsProps {
  currentUser: IUser | null;
  openModal: () => void;
}

export default function AddFunds({ currentUser, openModal }: AddFundsProps) {
  return (
    <div>
      {currentUser?.role === UserRole.CLIENT && (
        <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/2.5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
              <ArrowDownToLine size={18} />
            </div>

            <div className="flex-1">
              <h2 className="text-sm font-semibold text-white">
                Add funds to your wallet
              </h2>

              <p className="mt-1 text-xs leading-5 text-white/30">
                Add money to your available balance to purchase services and
                manage your orders.
              </p>
            </div>

            <button
              type="button"
              onClick={openModal}
              className="hidden rounded-xl border border-white/8 bg-white/3 px-4 py-2.5 text-xs font-semibold text-white/70 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy sm:block"
            >
              Add Funds
            </button>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/3 text-xs font-semibold text-white/70 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy sm:hidden"
          >
            <ArrowDownToLine size={14} />
            Add Funds
          </button>
        </section>
      )}
    </div>
  );
}
