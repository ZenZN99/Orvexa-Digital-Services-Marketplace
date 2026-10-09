"use client";

import { ArrowDownToLine, Loader2 } from "lucide-react";
import React from "react";

interface FooterProps {
  onClose: () => void;
  loading: boolean;
  balance: number;
  handleSubmit: () => void;
}

export default function Footer({
  onClose,
  loading,
  balance,
  handleSubmit,
}: FooterProps) {
  return (
    <div className="relative flex justify-end gap-3 border-t border-white/6 px-6 py-5">
      <button
        type="button"
        onClick={onClose}
        disabled={loading}
        className="h-10 rounded-xl border border-white/10 px-4 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || balance <= 0}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-green px-4 text-xs font-bold text-brand-navy transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowDownToLine className="h-4 w-4" />
        )}

        {loading ? "Processing..." : "Confirm Withdrawal"}
      </button>
    </div>
  );
}
