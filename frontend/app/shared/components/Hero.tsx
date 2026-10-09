import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const avatars = [
  "https://i.pravatar.cc/100?img=12",
  "https://i.pravatar.cc/100?img=32",
  "https://i.pravatar.cc/100?img=47",
  "https://i.pravatar.cc/100?img=56",
  "https://i.pravatar.cc/100?img=68",
];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy px-6 pt-24">
      {/* Main Glow */}
      <div className="pointer-events-none absolute left-1/2 top-[35%] h-130 w-130 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green/7 blur-[150px]" />

      {/* Subtle Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(#fff 1px, transparent 1px),
            linear-gradient(90deg, #fff 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(circle at center, black, transparent 72%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/6 px-4 py-2 text-xs font-medium text-brand-green backdrop-blur-xl">
          <Sparkles size={14} />

          <span>The modern freelance marketplace</span>
        </div>

        {/* Heading */}
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl lg:text-[82px]">
          Where great work
          <span className="block text-brand-green">finds great people.</span>
        </h1>

        {/* Description */}
        <p className="mt-7 max-w-2xl text-base leading-7 text-white/45 sm:text-lg sm:leading-8">
          Orvexa connects businesses with talented freelancers to turn ideas
          into real work, faster and simpler.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/services"
            className="group flex h-12 items-center gap-2 rounded-xl bg-brand-green px-6 text-sm font-semibold text-brand-navy shadow-[0_0_40px_rgba(0,220,130,0.12)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_50px_rgba(0,220,130,0.2)]"
          >
            Explore Services
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/how-it-works"
            className="flex h-12 items-center gap-2 rounded-xl border border-white/1 bg-white/2.5 px-6 text-sm font-medium text-white backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
          >
            <Sparkles size={15} />
            How It Works
          </Link>
        </div>

        <div className="mt-12 flex items-center gap-4">
          {/* Avatar Stack */}
          <div className="flex items-center">
            {avatars.map((avatar, index) => (
              <div
                key={avatar}
                className={`relative h-9 w-9 overflow-hidden rounded-full border-2 border-brand-navy bg-white/10 ${
                  index !== 0 ? "-ml-2" : ""
                }`}
              >
                <img
                  src={avatar}
                  alt="Orvexa user"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}

            {/* More Users */}
            <div className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-navy bg-brand-green text-[10px] font-bold text-brand-navy">
              +
            </div>
          </div>

          {/* User Count */}
          <div className="text-left">
            <p className="text-sm font-semibold text-white">1,000+ users</p>

            <p className="mt-0.5 text-[11px] text-white/30">
              Growing every day
            </p>
          </div>
        </div>

        {/* Trust */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs text-white/30">
          <span className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-green/10">
              <Check size={10} className="text-brand-green" />
            </span>
            Verified Freelancers
          </span>

          <span className="hidden h-3 w-px bg-white/10 sm:block" />

          <span className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-green/10">
              <Check size={10} className="text-brand-green" />
            </span>
            Secure Payments
          </span>

          <span className="hidden h-3 w-px bg-white/10 sm:block" />

          <span className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-green/10">
              <Check size={10} className="text-brand-green" />
            </span>
            Built for Professionals
          </span>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-brand-navy to-transparent" />
    </section>
  );
}
