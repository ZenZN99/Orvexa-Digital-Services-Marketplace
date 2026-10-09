"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { topics } from "../conversation/[id]/components/utils/topics";

export default function Topics() {
  return (
    <section className="border-t border-white/5 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
            Support topics
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            What can we help you with?
          </h2>

          <p className="mt-4 text-sm leading-6 text-white/35">
            Choose a topic or contact our support team directly if you are not
            sure where to start.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
              <Link
                key={topic.title}
                href="/support/conversations"
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-green/20 hover:bg-white/4"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-green/0 blur-3xl transition duration-500 group-hover:bg-brand-green/8" />

                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-green/10 bg-brand-green/6">
                    <Icon size={19} className="text-brand-green" />
                  </div>

                  <div className="mt-7 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      {topic.title}
                    </h3>

                    <ArrowRight
                      size={15}
                      className="text-white/20 transition duration-300 group-hover:translate-x-1 group-hover:text-brand-green"
                    />
                  </div>

                  <p className="mt-2 text-sm leading-6 text-white/35">
                    {topic.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
