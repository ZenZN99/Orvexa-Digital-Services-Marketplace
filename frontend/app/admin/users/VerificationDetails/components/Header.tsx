"use client";

import { FileCheck2, X } from "lucide-react";

interface HeaderProps {
  onClose?: () => void;
}

export default function Header({ onClose }: HeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10">
          <FileCheck2 size={19} className="text-brand-green" />
        </div>

        <div>
          <h2 className="text-base font-semibold text-white">
            Verification Details
          </h2>

          <p className="mt-1 text-xs text-white/30">
            Review the verification status for this account.
          </p>
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/5 hover:text-white/60"
          aria-label="Close details"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
