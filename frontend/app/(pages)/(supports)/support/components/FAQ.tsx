"use client";

import { ChevronDown } from "lucide-react";
import { faqs } from "../conversation/[id]/components/utils/faqs";

export default function FAQ() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-white/5 px-5 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
            FAQ
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/35">
            Find quick answers to some of the most common questions about
            Orvexa.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group overflow-hidden rounded-2xl border border-white/8 bg-white/3 transition duration-300"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-6 py-5 text-sm font-medium text-white/80  sm:px-7">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-brand-green/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>{faq.question}</span>
                </div>

                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/3">
                  <ChevronDown
                    size={14}
                    className="text-white/35 transition duration-300 group-open:rotate-180"
                  />
                </span>
              </summary>

              <div className="px-6 pb-6 sm:px-7">
                <div className="ml-8 border-t border-white/6 pt-5">
                  <p className="max-w-3xl text-sm leading-7 text-white/40">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
