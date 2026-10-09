"use client";

import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";

export default function ContactBanner() {
  return (
    <section className="px-5 pb-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/3">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-green/7 blur-[110px]" />

          <div className="relative flex flex-col gap-7 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green/10">
                <Headphones size={19} className="text-brand-green" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Can't find what you're looking for?
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
                  Tell us what you need and provide the relevant details. We'll
                  help you figure out the next step.
                </p>
              </div>
            </div>

            <Link
              href="/support/conversations"
              className="group flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-green px-5 text-sm font-semibold text-brand-navy transition hover:brightness-110"
            >
              Contact Support
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
