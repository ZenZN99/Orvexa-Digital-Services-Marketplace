"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Home, LockKeyhole } from "lucide-react";

export default function ClosedConversation() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy px-6 py-20 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/10 blur-[140px]" />

        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-brand-green/4 blur-3xl" />

        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-brand-green/4 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.035] shadow-2xl shadow-black/20">
          <LockKeyhole
            size={28}
            strokeWidth={1.7}
            className="text-brand-green"
          />
        </div>

        {/* Status */}
        <div className="relative">
          <span className="select-none text-[100px] font-black leading-none tracking-[-0.08em] text-white/4 sm:text-[150px]">
            CLOSED
          </span>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-black tracking-[-0.06em] text-white sm:text-7xl">
              CLOSED
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-2 max-w-xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
            Conversation closed
          </span>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            This conversation is no longer active.
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/50 sm:text-base">
            This support conversation has been closed, so sending new messages
            is no longer available.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/support"
            className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-brand-green px-6 text-sm font-semibold text-white shadow-lg shadow-brand-green/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-green/20 sm:w-auto"
          >
            <ArrowLeft
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to support
          </Link>

          <Link
            href="/"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/9 bg-white/2.5 px-6 text-sm font-medium text-white/75 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/5 hover:text-white sm:w-auto"
          >
            <Home size={16} strokeWidth={2} />
            Home
            <ArrowRight
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Bottom hint */}
        <p className="mt-12 text-xs text-white/25">
          Orvexa · Where great work finds great people.
        </p>
      </div>
    </main>
  );
}
