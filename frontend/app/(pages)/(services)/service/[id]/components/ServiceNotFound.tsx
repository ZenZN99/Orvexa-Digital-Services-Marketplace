"use client";

import { ArrowLeft, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ServiceNotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy px-6 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/6 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg text-center">
        {/* 404 */}
        <div className="relative mx-auto w-fit">
          <span className="select-none text-[110px] font-black leading-none tracking-[-0.08em] text-white/[0.035] sm:text-[140px]">
            404
          </span>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-green/20 bg-brand-green/10 shadow-[0_0_40px_rgba(34,197,94,0.08)]">
              <SearchX
                size={27}
                strokeWidth={1.8}
                className="text-brand-green"
              />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Service unavailable
        </h1>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
          We couldn’t find the service you’re looking for. It may have been
          removed, unpublished, or the link may no longer be valid.
        </p>

        {/* Divider */}
        <div className="mx-auto mt-7 h-px w-16 bg-brand-green/30" />

        {/* Action */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-green px-5 text-sm font-semibold text-brand-navy shadow-lg shadow-brand-green/10 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-brand-green/20"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        {/* Small Status */}
        <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-white/20">
          Service not found
        </p>
      </div>
    </main>
  );
}
