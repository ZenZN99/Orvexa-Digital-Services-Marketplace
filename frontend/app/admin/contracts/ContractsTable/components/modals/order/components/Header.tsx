"use client";

import { ShoppingBag, X } from "lucide-react";

interface HeaderProps {
  onClose: () => void;
}

export default function Header({onClose} : HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10">
          <ShoppingBag size={18} className="text-brand-green" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Order Details</h2>

          <p className="mt-0.5 text-xs text-white/30">
            Order information and services
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
      >
        <X size={18} />
      </button>
    </div>
  );
}
