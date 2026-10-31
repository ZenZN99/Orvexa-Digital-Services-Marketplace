"use client";

import { X } from "lucide-react";

interface HeaderProps {
  onClose: () => void;
  loading: boolean;
}

export default function Header({ onClose, loading }: HeaderProps) {
  return (
    <div className="relative flex items-center justify-between border-b border-white/6 px-6 py-5">
      <div>
        <h2
          id="withdrawal-modal-title"
          className="text-lg font-bold text-white"
        >
          Withdraw Funds
        </h2>

        <p className="mt-1 text-sm text-white/35">
          Withdraw funds from the platform wallet.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        aria-label="Close withdrawal modal"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/5 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
