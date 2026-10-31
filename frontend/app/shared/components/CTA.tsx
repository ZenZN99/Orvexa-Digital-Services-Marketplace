import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-brand-navy py-16 sm:py-20">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-brand-green px-6 py-10 text-center sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/8 blur-[90px]" />

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full border border-white/8" />
          <div className="pointer-events-none absolute -bottom-20 -right-16 h-48 w-48 rounded-full border border-white/8" />

          <div className="relative mx-auto max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/8 px-3 py-1.5">
              <Sparkles size={12} strokeWidth={2} className="text-white" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                Start with Orvexa
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl lg:leading-[1.15]">
              Ready to bring your next idea to life?
            </h2>

            {/* Description */}
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              Find the right talent, discover exceptional services, and turn
              your ideas into real results with Orvexa.
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <Link
                href="/services"
                className="group flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-white px-5 text-sm font-semibold text-brand-green shadow-lg shadow-black/10 transition-all duration-300 hover:bg-white/90 sm:w-auto"
              >
                Explore Services
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/create-service"
                className="group flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-white/25 bg-white/8 px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-brand-green sm:w-auto"
              >
                Start Selling
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
