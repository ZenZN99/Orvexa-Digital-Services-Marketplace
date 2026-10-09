import Image from "next/image";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <section className="relative overflow-hidden bg-brand-navy py-24 sm:py-32">
      {/* Background detail */}
      <div className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-brand-green/6 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* Image */}
          <div className="group relative">
            <div className="absolute -inset-3 rounded-4xl border border-brand-green/10 transition duration-700 group-hover:border-brand-green/20" />

            <div className="relative aspect-4/3 overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/2">
              <Image
                src="/logo.png"
                alt="Orvexa marketplace"
                fill
                priority
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-linear-to-tr from-brand-navy/70 via-transparent to-brand-green/10" />

              {/* Floating metric */}
              <div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-brand-navy/80 px-5 py-4 shadow-2xl backdrop-blur-xl sm:bottom-7 sm:left-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green/10">
                    <CheckCircle2 size={18} className="text-brand-green" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Built for real work
                    </p>
                    <p className="mt-0.5 text-xs text-white/40">
                      Simple. Secure. Reliable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green/15 bg-brand-green/6 px-3.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
                About Orvexa
              </span>
            </div>

            <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
              Where talent meets
              <span className="text-brand-green"> opportunity.</span>
            </h2>

            <p className="mt-6 text-base leading-7 text-white/45 sm:text-lg">
              Orvexa is a modern marketplace built to connect talented
              freelancers with people and businesses looking for great work. We
              make the entire journey simpler — from discovering a service to
              delivering the final result.
            </p>

            <p className="mt-4 text-base leading-7 text-white/35">
              Whether you are building your next product, growing your business,
              or turning your skills into a career, Orvexa gives you the tools
              to make it happen.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Verified talent",
                "Secure payments",
                "Simple collaboration",
                "Built for creators",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={17}
                    strokeWidth={2}
                    className="shrink-0 text-brand-green"
                  />

                  <span className="text-sm text-white/65">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="/about"
              className="group mt-9 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-brand-green"
            >
              Learn more about Orvexa
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
