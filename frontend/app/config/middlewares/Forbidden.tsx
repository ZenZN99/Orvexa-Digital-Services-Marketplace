"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Home, ShieldX } from "lucide-react";

export default function Forbidden() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy px-6">
      {/* Background */}

      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl" />

      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-white/3 blur-3xl" />

      {/* Card */}

      <div className="relative w-full max-w-xl rounded-4xl border border-white/[0.07] bg-white/3 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
        {/* Badge */}

        <div className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/4 px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
            <ShieldX className="h-4 w-4 text-red-400" strokeWidth={1.8} />
            Access Forbidden
          </span>
        </div>

        {/* Icon */}

        <div className="mb-8 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div
              className="absolute inset-0 animate-[spin_5s_linear_infinite] rounded-full opacity-70"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(239,68,68,0.35), transparent 65%)",
              }}
            />

            <div className="absolute inset-0.75 rounded-full bg-brand-navy" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-red-400/15 bg-red-400/10 shadow-[0_0_50px_rgba(239,68,68,0.08)]">
              <ShieldX className="h-9 w-9 text-red-400" strokeWidth={1.7} />
            </div>
          </div>
        </div>

        {/* Title */}

        <h1 className="text-3xl font-semibold tracking-tight text-white/90 sm:text-4xl">
          Access forbidden
        </h1>

        <p className="mt-3 text-base font-medium text-white/40">
          You don't have permission to access this page.
        </p>

        {/* Description */}

        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/35">
          Your account does not have the required permissions to access this
          section. Please return to a page you have access to.
        </p>

        {/* Actions */}

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {/* Back */}

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-brand-green px-7 text-sm font-semibold text-brand-navy shadow-[0_8px_30px_rgba(0,220,130,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:w-auto sm:min-w-44"
          >
            <ArrowLeft className="h-4.5 w-4.5" strokeWidth={2} />
            Go Back
          </button>

          {/* Home */}

          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-white/8 bg-white/3 px-7 text-sm font-medium text-white/65 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/12 hover:bg-white/6 hover:text-white sm:w-auto sm:min-w-44"
          >
            <Home className="h-4.5 w-4.5" strokeWidth={1.8} />
            Back to Home
          </button>
        </div>
      </div>
    </main>
  );
}
