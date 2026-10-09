"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface SyncErrorProps {
  syncFailed: boolean;
  handleRetry: () => void;
  loading: {
    global: boolean;
  };
}

export default function SyncError({
  syncFailed,
  handleRetry,
  loading,
}: SyncErrorProps) {
  return (
    <div>
      {syncFailed && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />

            <p className="text-sm text-red-200/90">
              We couldn&apos;t refresh the wallet balance. The amount shown may
              be outdated.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRetry}
            disabled={loading.global}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-red-400/15 px-3 text-xs font-semibold text-red-200 transition hover:bg-red-400/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
