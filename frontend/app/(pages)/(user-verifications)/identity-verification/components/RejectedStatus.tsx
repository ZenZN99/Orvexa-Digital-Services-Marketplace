"use client";

import { IUser } from "@/app/types/user";
import { ShieldCheck, ShieldX } from "lucide-react";

interface RejectedStatusProps {
  currentUser: IUser | null;
  tryingAgain: boolean;
  onTryAgain: () => void;
}

export default function RejectedStatus({
  currentUser,
  tryingAgain,
  onTryAgain,
}: RejectedStatusProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-navy px-5 pt-20 text-white">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.06)]">
          <ShieldX size={30} strokeWidth={1.7} className="text-red-400" />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-400">
          Verification failed
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Identity verification failed
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
          Unfortunately, we couldn&apos;t verify your identity with the
          submitted documents.
        </p>

        {currentUser?.verification?.rejectionReason && (
          <div className="mt-5 rounded-2xl border border-red-500/15 bg-red-500/4 p-4 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-400">
              Rejection reason
            </p>
            <p className="mt-1.5 text-sm leading-6 text-white/60">
              {currentUser.verification.rejectionReason}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onTryAgain}
          disabled={tryingAgain}
          className="mt-7 inline-flex h-11 min-w-52 items-center justify-center gap-2 rounded-xl bg-brand-green px-6 text-sm font-semibold text-brand-navy shadow-[0_8px_30px_rgba(0,220,130,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {tryingAgain ? (
            "Please wait..."
          ) : (
            <>
              <ShieldCheck size={17} />
              Try again
            </>
          )}
        </button>
      </div>
    </main>
  );
}
