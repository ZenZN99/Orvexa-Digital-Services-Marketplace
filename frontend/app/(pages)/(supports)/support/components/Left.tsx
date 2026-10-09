"use client";

import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

export default function Left() {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/15 bg-brand-green/5 px-3.5 py-2 text-xs font-medium text-brand-green">
        <Headphones size={14} />
        Orvexa Support
      </div>

      <h1 className="mt-7 max-w-xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
        Need help?
        <span className="block text-brand-green">We're here for you.</span>
      </h1>

      <p className="mt-6 max-w-lg text-base leading-7 text-white/40 sm:text-lg sm:leading-8">
        Get help with your orders, payments, account, or anything else you need
        while using Orvexa.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/support/conversations"
          className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-green px-6 text-sm font-semibold text-brand-navy transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
        >
          <MessageCircle size={16} />
          Send us a message
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

        <a
          href="#faq"
          className="flex h-12 items-center justify-center rounded-xl border border-white/8 bg-white/3 px-6 text-sm font-medium text-white/60 transition hover:border-white/15 hover:bg-white/5 hover:text-white"
        >
          Browse FAQ
        </a>
      </div>

      <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs text-white/25">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-brand-green/70" />
          Secure support
        </div>

        <div className="hidden h-3 w-px bg-white/10 sm:block" />

        <div className="flex items-center gap-2">
          <MessageCircle size={14} className="text-brand-green/70" />
          Direct assistance
        </div>
      </div>
    </div>
  );
}
