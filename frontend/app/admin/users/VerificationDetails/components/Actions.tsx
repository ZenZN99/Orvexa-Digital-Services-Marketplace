"use client";

import { IUserVerification } from "@/app/types/user-verification";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface ActionsProps {
  verification: IUserVerification;
  updating: boolean;
  rejectionReason: string;
  setRejectionReason: (value: string) => void;
  onApprove?: (verification: IUserVerification) => void;
  onReject?: (verification: IUserVerification, rejectionReason: string) => void;
}

export default function Actions({
  verification,
  updating,
  rejectionReason,
  setRejectionReason,
  onApprove,
  onReject,
}: ActionsProps) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
      <p className="text-xs leading-5 text-white/30">
        Review the submitted verification documents before approving or
        rejecting this request.
      </p>

      <textarea
        value={rejectionReason}
        onChange={(event) => setRejectionReason(event.target.value)}
        placeholder="Optional rejection reason (used only if you reject)..."
        rows={2}
        className="mt-4 w-full resize-none rounded-xl border border-white/8 bg-white/3 p-3 text-xs text-white outline-none"
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {onApprove && (
          <button
            type="button"
            disabled={updating}
            onClick={() => onApprove(verification)}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-green px-4 text-xs font-semibold text-brand-navy transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            {updating ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <CheckCircle2 size={15} />
            )}
            Approve Verification
          </button>
        )}

        {onReject && (
          <button
            type="button"
            disabled={updating}
            onClick={() => onReject(verification, rejectionReason.trim())}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/15 bg-red-400/6 px-4 text-xs font-semibold text-red-300 transition hover:bg-red-400/10 active:scale-[0.98] disabled:opacity-50"
          >
            {updating ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <AlertCircle size={15} />
            )}
            Reject Verification
          </button>
        )}
      </div>
    </section>
  );
}
