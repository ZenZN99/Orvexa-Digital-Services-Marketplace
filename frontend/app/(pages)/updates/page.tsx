"use client";

import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  Code2,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

const upcomingUpdates = [
  {
    icon: MessageSquare,
    title: "Enhanced Messaging",
    description:
      "A better messaging experience with improved conversations, faster interactions, and more communication tools.",
    status: "Coming soon",
  },
  {
    icon: Wallet,
    title: "Payments & Wallet",
    description:
      "More powerful payment and wallet features designed to make transactions between clients and freelancers easier.",
    status: "In development",
  },
  {
    icon: ShieldCheck,
    title: "Advanced Security",
    description:
      "Additional security improvements to make accounts, transactions, and marketplace activity safer.",
    status: "Planned",
  },
  {
    icon: Sparkles,
    title: "Smarter Recommendations",
    description:
      "Improved service discovery and recommendations to help clients find the right freelancers faster.",
    status: "Planned",
  },
  {
    icon: Code2,
    title: "Developer Improvements",
    description:
      "Continuous improvements to the platform infrastructure, performance, APIs, and overall developer experience.",
    status: "In development",
  },
  {
    icon: Rocket,
    title: "More Marketplace Features",
    description:
      "New tools and features are being planned to make working on Orvexa more flexible for both clients and freelancers.",
    status: "Coming soon",
  },
];

export default function UpdatesPage() {
  return (
    <main className="min-h-screen bg-brand-navy text-white">
      <section className="relative overflow-hidden border-b border-white/6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,220,130,0.08),transparent_45%)]" />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 sm:px-10 lg:px-16 lg:pb-28 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-green/20 bg-brand-green/10 text-brand-green">
              <Rocket size={21} />
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-green/15 bg-brand-green/5 px-3 py-1.5 text-[11px] font-medium text-brand-green">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
              Orvexa is constantly evolving
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              What&apos;s coming to{" "}
              <span className="text-brand-green">Orvexa</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
              We&apos;re building new features, improving the platform, and
              working on a better experience for clients and freelancers.
              Here&apos;s a look at what&apos;s coming next.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-green">
              Roadmap
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Upcoming features
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/35">
              These are some of the improvements and features currently being
              planned or developed.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/25">
            <Clock3 size={14} />
            More updates will be announced here
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {upcomingUpdates.map((update) => {
            const Icon = update.icon;

            return (
              <article
                key={update.title}
                className="group rounded-2xl border border-white/6 bg-white/2 p-6 transition duration-300 hover:border-brand-green/15 hover:bg-white/[0.035]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green transition group-hover:bg-brand-green/15">
                    <Icon size={19} />
                  </div>

                  <span className="rounded-full border border-white/6 bg-white/3 px-2.5 py-1 text-[10px] font-medium text-white/30">
                    {update.status}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-semibold text-white/85">
                  {update.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/35">
                  {update.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-brand-green/10 bg-brand-green/[0.035] p-8 sm:p-10">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-green/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-brand-green">
                <Bell size={17} />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Stay updated
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                More is on the way.
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Orvexa is still growing. We&apos;ll continue shipping
                improvements and new features to make the marketplace better.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-xs text-white/35">
              <CheckCircle2 size={15} className="text-brand-green" />
              Built continuously
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
