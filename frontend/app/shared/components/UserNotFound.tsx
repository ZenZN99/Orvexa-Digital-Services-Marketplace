"use client";

import { ArrowLeft, UserRoundX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserNotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-brand-navy pt-20 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-2xl items-center justify-center px-6">
        <div className="relative w-full overflow-hidden rounded-3xl border border-white/[0.07] bg-brand-navy/15 px-6 py-16 text-center shadow-[0_20px_80px_rgba(0,0,0,0.2)] sm:px-10">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/[0.035] blur-3xl" />

          <div className="relative">
            <div className="relative mx-auto mb-7 w-fit">
              <div className="absolute inset-0 rounded-[26px] bg-brand-green/6 blur-2xl" />

              <div className="relative flex h-24 w-24 items-center justify-center rounded-[26px] border border-white/8 bg-white/[0.035] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                <UserRoundX
                  size={42}
                  strokeWidth={1.5}
                  className="text-white/35"
                />
              </div>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              User not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/35 sm:text-base">
              The profile you're looking for doesn't exist or may have been
              removed.
            </p>

            <button
              type="button"
              onClick={() => router.back()}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-semibold text-brand-navy shadow-[0_8px_30px_rgba(0,220,130,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_35px_rgba(0,220,130,0.14)] active:translate-y-0"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
