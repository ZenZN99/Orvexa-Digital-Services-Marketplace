"use client";

import { IUser, UserRole } from "@/app/types/user";
import { ArrowDownToLine } from "lucide-react";

interface HeaderProps {
  currentUser?: IUser | null;
  openModal: () => void;
}

export default function Header({ currentUser, openModal }: HeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
          Wallet
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Your Balance : {currentUser?.balance}
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
          Manage your available and frozen funds from one place.
        </p>
      </div>

      {currentUser?.role === UserRole.CLIENT && (
        <button
          type="button"
          onClick={openModal}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-green px-5 text-sm font-semibold text-brand-navy transition hover:brightness-110"
        >
          <ArrowDownToLine size={17} />
          Add Funds
        </button>
      )}
    </div>
  );
}
