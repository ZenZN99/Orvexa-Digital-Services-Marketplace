"use client";

import { Loader2 } from "lucide-react";

interface ButtonProps {
  isValid: boolean;
  loading: {
    updating: boolean;
  };
}

export default function Button({ isValid, loading }: ButtonProps) {
  return (
    <button
      type="submit"
      disabled={!isValid || loading.updating}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green py-3 text-sm font-semibold text-brand-navy transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {loading.updating && <Loader2 size={16} className="animate-spin" />}
      Save changes
    </button>
  );
}
