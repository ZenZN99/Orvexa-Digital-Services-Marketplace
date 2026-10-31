"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Hammer,
  Lock,
  MessageSquare,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Undo2,
  UserPlus,
  Wallet,
  LifeBuoy,
} from "lucide-react";

import CTA from "@/app/shared/components/CTA";

const PLATFORM_FEE = 0.05; // 5% commission, taken when a contract is completed

type Audience = "client" | "freelancer";

const journeys: Record<
  Audience,
  {
    label: string;
    title: string;
    intro: string;
    steps: {
      icon: typeof Search;
      title: string;
      text: string;
      points: string[];
    }[];
  }
> = {
  client: {
    label: "I'm hiring",
    title: "Hire with confidence, from search to delivery.",
    intro:
      "Everything you need to find a freelancer, pay safely, and get the work you paid for.",
    steps: [
      {
        icon: UserPlus,
        title: "Create your account & verify",
        text: "Sign up, then submit a profile photo and an identity document. Once our team approves it, you're ready to pay for orders.",
        points: [
          "Verification is a one-time step",
          "If a request is rejected, you'll see the reason and can resubmit",
        ],
      },
      {
        icon: Search,
        title: "Find the right service",
        text: "Browse published services, compare prices and delivery times, and add the ones you like to your cart.",
        points: [
          "Every service shows its price, delivery time, and reviews",
          "Services are approved by our team before they go live",
        ],
      },
      {
        icon: Wallet,
        title: "Place your order & pay",
        text: "Top up your balance, turn your cart into an order, and pay. Your money is held safely, not sent to the freelancer yet.",
        points: [
          "A new order starts as Pending payment",
          "Paying moves the amount from your balance into a held balance",
        ],
      },
      {
        icon: Hammer,
        title: "Follow the work",
        text: "A contract starts right away with a delivery deadline. Chat with the freelancer inside the contract while the work is in progress.",
        points: [
          "You're notified as soon as the work is delivered",
          "Every contract has a deadline that protects you",
        ],
      },
      {
        icon: Star,
        title: "Approve & review",
        text: "Happy with the delivery? Accept it and the payment is released. Then leave a review to help the next client.",
        points: [
          "You can review a service once its contract is completed",
          "One review per service keeps feedback honest",
        ],
      },
    ],
  },
  freelancer: {
    label: "I'm selling",
    title: "Turn your skills into a steady stream of work.",
    intro:
      "Publish services, get paid fairly, and build a reputation that brings in the next client.",
    steps: [
      {
        icon: UserPlus,
        title: "Join as a freelancer & verify",
        text: "Create your account as a freelancer and verify your identity. It's required before you can publish services or deliver contracts.",
        points: [
          "Add your profile, skills, and what you're great at",
          "Rejected? Fix the issue and resubmit",
        ],
      },
      {
        icon: Store,
        title: "Publish a service",
        text: "Package what you do with a clear description, price, delivery time, features, keywords, and up to 5 images.",
        points: [
          "You can have up to 15 services at a time",
          "Each one is reviewed first: Pending, then Published or Rejected with a reason",
        ],
      },
      {
        icon: FileText,
        title: "Get a contract",
        text: "When a client pays, a contract starts automatically and you're notified. Its deadline is based on your delivery time.",
        points: [
          "The client's payment is already secured when you start",
          "Chat with the client inside the contract",
        ],
      },
      {
        icon: PackageCheck,
        title: "Deliver on time",
        text: "Finish the work and mark the contract as delivered before the deadline. The client is notified to review it.",
        points: [
          "Delivering moves the contract to Delivered",
          "Miss the deadline and the contract expires with a refund",
        ],
      },
      {
        icon: Wallet,
        title: "Get paid & grow",
        text: "When the client accepts, 95% of the contract amount is added to your balance. Completed work and reviews build your reputation.",
        points: [
          "Orvexa keeps a 5% fee only on completed contracts",
          "Your completed orders count shows on your profile",
        ],
      },
    ],
  },
};

const escrowStages = [
  {
    title: "You pay",
    text: "Money moves from the client's balance into a held balance.",
  },
  {
    title: "Held safely",
    text: "The freelancer works. The money waits, untouched by either side.",
  },
  {
    title: "You approve",
    text: "The client reviews the delivery and accepts it.",
  },
  {
    title: "Paid out",
    text: "The freelancer is paid and Orvexa takes its 5% fee.",
  },
];

const lifecycle = [
  {
    status: "In progress",
    tone: "blue" as const,
    icon: Hammer,
    text: "Starts the moment payment goes through.",
    client: "Chats with the freelancer and waits for delivery.",
    freelancer: "Works on the project before the deadline.",
  },
  {
    status: "Delivered",
    tone: "purple" as const,
    icon: PackageCheck,
    text: "The freelancer says the work is ready.",
    client: "Gets notified and reviews the result.",
    freelancer: "Waits for the client's decision.",
  },
  {
    status: "Completed",
    tone: "green" as const,
    icon: CheckCircle2,
    text: "The client accepts and the contract closes.",
    client: "Can now leave a review.",
    freelancer: "Receives 95% of the amount.",
  },
];

const trust = [
  {
    icon: BadgeCheck,
    title: "Verified identities",
    text: "Paying, publishing services, and delivering work all require an approved identity check.",
  },
  {
    icon: Lock,
    title: "Held payments",
    text: "A client's payment stays in a held balance until the work is accepted.",
  },
  {
    icon: Undo2,
    title: "Automatic refunds",
    text: "If a contract isn't delivered by its deadline, the held amount returns to the client automatically.",
  },
  {
    icon: MessageSquare,
    title: "Chat inside the contract",
    text: "Talk about the work in one place, with text and images, while the contract is active.",
  },
  {
    icon: Bell,
    title: "Live notifications",
    text: "Payments, deliveries, and completions reach both sides in real time.",
  },
  {
    icon: LifeBuoy,
    title: "Real support",
    text: "Open a support conversation any time and the Orvexa team will pick it up.",
  },
];

const faqs = [
  {
    q: "Do I need to verify my identity?",
    a: "Yes. You submit a profile photo and an identity document, and an Orvexa admin reviews them. Verification is required to pay for orders, publish services, and deliver or accept contracts. If it's rejected, you'll see the reason and can submit again.",
  },
  {
    q: "Is my money safe when I pay?",
    a: "When you pay, the amount moves from your balance into a held balance. It only goes to the freelancer after you accept the delivery. If the freelancer misses the deadline, the amount is returned to your balance.",
  },
  {
    q: "How much does Orvexa charge?",
    a: "Clients pay the service price and nothing extra. When a contract is completed, Orvexa keeps a 5% fee and the freelancer receives the remaining 95%. There is no fee on contracts that aren't completed.",
  },
  {
    q: "What happens if the freelancer doesn't deliver?",
    a: "Every contract has a deadline based on the service's delivery time. If it passes while the contract is still in progress, the contract expires, your held payment is refunded to your balance, and both sides are notified.",
  },
  {
    q: "Can I leave a review?",
    a: "Yes, once the contract for that service has been completed. You can review each service once, which keeps ratings tied to real, paid work.",
  },
  {
    q: "How many services can I publish?",
    a: "Up to 15 at a time, with up to 5 images each. New and edited services go through a review first, and rejected ones come back with a reason so you can fix them.",
  },
  {
    q: "I need help. What do I do?",
    a: "Open a support conversation from the Support page. You can have one open conversation at a time, and the Orvexa support team replies in the same thread.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers & hooks                                                           */
/* -------------------------------------------------------------------------- */

const formatMoney = (value: number) =>
  `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function useCycle(length: number, ms: number, paused = false) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const id = setInterval(() => setIndex((value) => (value + 1) % length), ms);

    return () => clearInterval(id);
  }, [length, ms, paused]);

  return [index, setIndex] as const;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function HowItWorksPage() {
  return (
    <main className="overflow-x-clip bg-brand-navy text-white">
      <PageStyles />

      <Hero />
      <Journey />
      <Escrow />
      <Lifecycle />
      <Reviews />
      <Trust />
      <Faq />

      <CTA />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

function Hero() {
  const [stage] = useCycle(3, 2600);

  const states = [
    { label: "In progress", tone: "blue" as const, amount: "Held", bar: 34 },
    { label: "Delivered", tone: "purple" as const, amount: "Held", bar: 67 },
    {
      label: "Completed",
      tone: "green" as const,
      amount: "Released",
      bar: 100,
    },
  ];

  const current = states[stage];

  return (
    <section className="relative">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
        }}
      />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-160 -translate-x-1/2 rounded-full bg-brand-green/15 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-20 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:pb-28 lg:pt-28">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-brand-green/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-green">
              <Sparkles size={12} />
              How it works
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              From idea to delivery,{" "}
              <span className="text-brand-green">without the guesswork.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              Orvexa keeps hiring simple and safe. Clients pay into a held
              balance, freelancers deliver within a deadline, and money only
              moves when the work is accepted.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/services"
                className="group flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-green px-6 text-sm font-semibold text-brand-navy transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_-6px_rgba(0,220,130,0.7)]"
              >
                Explore services
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#journey"
                className="flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/3 px-6 text-sm font-semibold text-white/80 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.07]"
              >
                See the steps
              </a>
            </div>
          </Reveal>
        </div>

        {/* Contract preview */}
        <Reveal delay={200}>
          <div className="relative mx-auto w-full max-w-md">
            <div className="hiw-float rounded-3xl border border-white/10 bg-white/4 p-5 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Logo design</p>
                    <p className="text-[11px] text-white/35">
                      Example contract
                    </p>
                  </div>
                </div>

                <Pill tone={current.tone} key={current.label}>
                  {current.label}
                </Pill>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-[11px] text-white/35">
                  <span>Progress</span>
                  <span>{current.bar}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-brand-green transition-all duration-1000 ease-out"
                    style={{ width: `${current.bar}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.07] bg-white/3 p-3.5">
                  <p className="text-[10px] uppercase tracking-widest text-white/30">
                    Amount
                  </p>
                  <p className="mt-1 text-lg font-semibold">$200.00</p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/3 p-3.5">
                  <p className="text-[10px] uppercase tracking-widest text-white/30">
                    Payment
                  </p>
                  <p
                    key={current.amount}
                    className="hiw-fade mt-1 flex items-center gap-1.5 text-lg font-semibold text-brand-green"
                  >
                    <Lock size={14} />
                    {current.amount}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-[11px] text-white/35">
                <Clock3 size={12} />
                Deadline based on the service&apos;s delivery time
              </div>
            </div>

            {/* Floating chips */}
            <div className="hiw-float-slow absolute -left-4 -top-5 hidden items-center gap-2 rounded-xl border border-white/10 bg-brand-navy/90 px-3 py-2 text-xs shadow-xl sm:flex">
              <ShieldCheck size={14} className="text-brand-green" />
              Identity verified
            </div>

            <div className="hiw-float-slow absolute -bottom-5 -right-3 hidden items-center gap-2 rounded-xl border border-white/10 bg-brand-navy/90 px-3 py-2 text-xs shadow-xl [animation-delay:-2s] sm:flex">
              <Wallet size={14} className="text-brand-green" />
              95% to the freelancer
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Journey                                                                   */
/* -------------------------------------------------------------------------- */

function Journey() {
  const [audience, setAudience] = useState<Audience>("client");
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useCycle(5, 5500, paused);

  const journey = journeys[audience];
  const active = journey.steps[step];
  const ActiveIcon = active.icon;

  return (
    <section id="journey" className="relative scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <SectionHeading
          eyebrow="Step by step"
          title="Two sides, one clear journey."
          text="Pick your side to see exactly what happens, in order."
        />

        {/* Toggle */}
        <Reveal>
          <div className="mx-auto mt-8 flex w-fit rounded-full border border-white/10 bg-white/3 p-1">
            {(Object.keys(journeys) as Audience[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setAudience(key);
                  setStep(0);
                }}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  audience === key
                    ? "bg-brand-green text-brand-navy shadow-[0_0_24px_-6px_rgba(0,220,130,0.7)]"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {journeys[key].label}
              </button>
            ))}
          </div>
        </Reveal>

        <div
          className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.1fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Steps */}
          <div key={audience} className="space-y-2">
            {journey.steps.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === step;
              const isDone = index < step;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`hiw-fade group relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                    isActive
                      ? "border-brand-green/30 bg-brand-green/[0.07]"
                      : "border-white/[0.07] bg-white/2 hover:border-white/15 hover:bg-white/4"
                  }`}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-brand-green text-brand-navy"
                        : isDone
                          ? "bg-brand-green/15 text-brand-green"
                          : "bg-white/5 text-white/40 group-hover:text-white/70"
                    }`}
                  >
                    {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/30">
                      Step {index + 1}
                    </p>
                    <p
                      className={`truncate text-sm font-semibold transition-colors duration-300 ${
                        isActive ? "text-white" : "text-white/65"
                      }`}
                    >
                      {item.title}
                    </p>
                  </div>

                  {isActive && !paused && (
                    <span className="hiw-timer absolute inset-x-4 bottom-0 h-px origin-left bg-brand-green" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detail */}
          <div
            key={`${audience}-${step}`}
            className="hiw-fade relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-7 sm:p-9"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-green/15 blur-3xl" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
                <ActiveIcon size={26} strokeWidth={1.6} />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand-green">
                Step {step + 1} of {journey.steps.length}
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {active.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/55 sm:text-base">
                {active.text}
              </p>

              <ul className="mt-6 space-y-3">
                {active.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm leading-6 text-white/65"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-1 shrink-0 text-brand-green"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <p className="mt-8 border-t border-white/[0.07] pt-5 text-xs text-white/35">
                {journey.title} {journey.intro}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Escrow                                                                    */
/* -------------------------------------------------------------------------- */

function Escrow() {
  const [paused, setPaused] = useState(false);
  const [stage, setStage] = useCycle(escrowStages.length, 2800, paused);
  const [price, setPrice] = useState(200);

  const fee = price * PLATFORM_FEE;
  const payout = price - fee;
  const progress = (stage / (escrowStages.length - 1)) * 100;

  return (
    <section className="relative border-y border-white/6 bg-white/1.5 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <SectionHeading
          eyebrow="Payments"
          title="Your money moves only when the work is accepted."
          text="Every payment goes through a held balance first. Try it with your own number."
        />

        <Reveal delay={80}>
          <div
            className="mx-auto mt-12 max-w-5xl rounded-3xl border border-white/8 bg-brand-navy p-6 sm:p-10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Track */}
            <div className="relative px-4 pb-2 pt-10 sm:px-8">
              <div className="absolute left-8 right-8 top-[3.35rem] h-0.5 rounded-full bg-white/8 sm:left-12 sm:right-12" />

              <div
                className="absolute left-8 top-[3.35rem] h-0.5 rounded-full bg-brand-green transition-all duration-1000 ease-out sm:left-12"
                style={{ width: `calc((100% - 4rem) * ${progress / 100})` }}
              />

              <div className="relative grid grid-cols-4 gap-2">
                {escrowStages.map((item, index) => {
                  const isActive = index === stage;
                  const isDone = index < stage;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setStage(index)}
                      className="group flex flex-col items-center text-center"
                    >
                      <div
                        className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-500 ${
                          isActive
                            ? "scale-125 border-brand-green bg-brand-green text-brand-navy shadow-[0_0_28px_-2px_rgba(0,220,130,0.8)]"
                            : isDone
                              ? "border-brand-green bg-brand-navy text-brand-green"
                              : "border-white/15 bg-brand-navy text-white/35 group-hover:border-white/30"
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={16} /> : index + 1}

                        {isActive && (
                          <span className="hiw-ring absolute inset-0 rounded-full border border-brand-green" />
                        )}
                      </div>

                      <p
                        className={`mt-4 text-xs font-semibold transition-colors duration-300 sm:text-sm ${
                          isActive ? "text-white" : "text-white/45"
                        }`}
                      >
                        {item.title}
                      </p>
                    </button>
                  );
                })}
              </div>

              <p
                key={stage}
                className="hiw-fade mx-auto mt-6 max-w-md text-center text-sm leading-6 text-white/50"
              >
                {escrowStages[stage].text}
              </p>
            </div>

            {/* Calculator */}
            <div className="mt-10 grid gap-6 border-t border-white/[0.07] pt-8 md:grid-cols-[1fr_1.2fr] md:items-center">
              <div>
                <label
                  htmlFor="price"
                  className="text-xs font-medium uppercase tracking-[0.12em] text-white/35"
                >
                  Service price
                </label>

                <p className="mt-2 text-4xl font-semibold tracking-tight">
                  {formatMoney(price)}
                </p>

                <input
                  id="price"
                  type="range"
                  min={10}
                  max={2000}
                  step={10}
                  value={price}
                  onChange={(event) => setPrice(Number(event.target.value))}
                  className="mt-5 h-1.5 w-full cursor-pointer accent-brand-green"
                />

                <div className="mt-1.5 flex justify-between text-[10px] text-white/25">
                  <span>$10</span>
                  <span>$2,000</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Amount
                  label="Client pays"
                  value={formatMoney(price)}
                  active={stage <= 1}
                />
                <Amount
                  label="Freelancer gets"
                  value={formatMoney(payout)}
                  active={stage === 3}
                  highlight
                />
                <Amount
                  label="Orvexa fee (5%)"
                  value={formatMoney(fee)}
                  active={stage === 3}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Amount({
  label,
  value,
  active,
  highlight = false,
}: {
  label: string;
  value: string;
  active: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-500 ${
        active
          ? highlight
            ? "border-brand-green/40 bg-brand-green/10"
            : "border-white/20 bg-white/6"
          : "border-white/[0.07] bg-white/2 opacity-60"
      }`}
    >
      <p className="text-[10px] font-medium uppercase tracking-widest text-white/35">
        {label}
      </p>

      <p
        className={`mt-1.5 text-base font-semibold sm:text-lg ${
          highlight && active ? "text-brand-green" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Contract lifecycle                                                        */
/* -------------------------------------------------------------------------- */

function Lifecycle() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <SectionHeading
          eyebrow="Contracts"
          title="The life of a contract."
          text="Each service in an order becomes its own contract with its own deadline, so both sides always know where things stand."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {lifecycle.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.status} delay={index * 100}>
                <div className="group relative h-full rounded-2xl border border-white/[0.07] bg-white/2.5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white/50 transition-colors duration-300 group-hover:bg-brand-green/10 group-hover:text-brand-green">
                      <Icon size={20} />
                    </div>

                    <Pill tone={item.tone}>{item.status}</Pill>
                  </div>

                  <p className="mt-5 text-sm font-medium text-white/80">
                    {item.text}
                  </p>

                  <dl className="mt-5 space-y-3 border-t border-white/6 pt-5 text-xs leading-5">
                    <div>
                      <dt className="font-semibold uppercase tracking-widest text-white/30">
                        Client
                      </dt>
                      <dd className="mt-0.5 text-white/55">{item.client}</dd>
                    </div>

                    <div>
                      <dt className="font-semibold uppercase tracking-widest text-white/30">
                        Freelancer
                      </dt>
                      <dd className="mt-0.5 text-white/55">
                        {item.freelancer}
                      </dd>
                    </div>
                  </dl>

                  {index < lifecycle.length - 1 && (
                    <ArrowRight
                      size={16}
                      className="absolute right-[-1.15rem] top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-brand-navy p-0.5 text-white/30 md:block"
                    />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Expiry */}
        <Reveal delay={150}>
          <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-orange-400/20 bg-orange-400/5 p-6 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-400/10 text-orange-400">
              <Undo2 size={22} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold">
                  What if the deadline passes?
                </h3>
                <Pill tone="orange">Expired</Pill>
              </div>

              <p className="mt-1.5 text-sm leading-6 text-white/55">
                If a contract is still in progress when its deadline arrives, it
                expires on its own. The held payment goes back to the
                client&apos;s balance and both sides are notified. No claim, no
                waiting.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reviews (verification + service approval)                                 */
/* -------------------------------------------------------------------------- */

function Reviews() {
  const flows = [
    {
      icon: ShieldCheck,
      title: "Identity verification",
      text: "A one-time check by the Orvexa team keeps the marketplace real.",
      start: { label: "Pending", tone: "orange" as const },
      ends: [
        { label: "Approved", tone: "green" as const },
        { label: "Rejected", tone: "red" as const },
      ],
      note: "Rejected requests include a reason, and you can resubmit.",
    },
    {
      icon: Store,
      title: "Service approval",
      text: "Every new or edited service is checked before clients can see it.",
      start: { label: "Pending", tone: "orange" as const },
      ends: [
        { label: "Published", tone: "green" as const },
        { label: "Rejected", tone: "red" as const },
      ],
      note: "Rejected services come back with a reason so you can fix them.",
    },
  ];

  return (
    <section className="border-y border-white/[6 bg-white/1.5 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <SectionHeading
          eyebrow="Quality"
          title="Reviewed by people, not just by rules."
          text="Two checks keep the quality of the marketplace high."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {flows.map((flow, index) => {
            const Icon = flow.icon;

            return (
              <Reveal key={flow.title} delay={index * 100}>
                <div className="h-full rounded-2xl border border-white/[0.07] bg-brand-navy p-6 transition-colors duration-300 hover:border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-base font-semibold">{flow.title}</h3>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/50">
                    {flow.text}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Pill tone={flow.start.tone}>{flow.start.label}</Pill>

                    <ArrowRight size={14} className="text-white/25" />

                    <div className="flex flex-wrap gap-2">
                      {flow.ends.map((end) => (
                        <Pill key={end.label} tone={end.tone}>
                          {end.label}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  <p className="mt-5 text-xs text-white/35">{flow.note}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Trust                                                                     */
/* -------------------------------------------------------------------------- */

function Trust() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <SectionHeading
          eyebrow="Trust & safety"
          title="Built so both sides can relax."
          text="The details that make working on Orvexa safer than a handshake."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trust.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.title} delay={(index % 3) * 90}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[2.5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/25 hover:bg-white/4">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-green/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon size={20} strokeWidth={1.7} />
                  </div>

                  <h3 className="relative mt-5 text-base font-semibold">
                    {item.title}
                  </h3>

                  <p className="relative mt-2 text-sm leading-6 text-white/50">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                       */
/* -------------------------------------------------------------------------- */

function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-white/6 bg-white/1.5 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Good questions, straight answers."
          text="Still unsure about something? Open a support conversation and we'll help."
        />

        <div className="mt-10 space-y-3">
          {faqs.map((item, index) => {
            const isOpen = open === index;

            return (
              <Reveal key={item.q} delay={index * 50}>
                <div
                  className={`rounded-2xl border transition-colors duration-300 ${
                    isOpen
                      ? "border-brand-green/25 bg-brand-green/4"
                      : "border-white/[0.07] bg-brand-navy hover:border-white/15"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="text-sm font-semibold sm:text-base">
                      {item.q}
                    </span>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-white/40 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-brand-green" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-7 text-white/55">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared UI                                                                 */
/* -------------------------------------------------------------------------- */

const pillTones = {
  blue: "border-blue-400/25 bg-blue-400/10 text-blue-300",
  purple: "border-purple-400/25 bg-purple-400/10 text-purple-300",
  green: "border-brand-green/25 bg-brand-green/10 text-brand-green",
  orange: "border-orange-400/25 bg-orange-400/10 text-orange-300",
  red: "border-red-400/25 bg-red-400/10 text-red-300",
};

function Pill({
  tone,
  children,
}: {
  tone: keyof typeof pillTones;
  children: ReactNode;
}) {
  return (
    <span
      className={`hiw-fade inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${pillTones[tone]}`}
    >
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
          {eyebrow}
        </p>
      </Reveal>

      <Reveal delay={70}>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
      </Reveal>

      <Reveal delay={140}>
        <p className="mt-4 text-sm leading-7 text-white/50 sm:text-base">
          {text}
        </p>
      </Reveal>
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`hiw-reveal ${shown ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function PageStyles() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }

      .hiw-reveal {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.7s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .hiw-reveal.is-in { opacity: 1; transform: none; }

      @keyframes hiw-fade {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: none; }
      }
      .hiw-fade { animation: hiw-fade 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }

      @keyframes hiw-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .hiw-float { animation: hiw-float 6s ease-in-out infinite; }
      .hiw-float-slow { animation: hiw-float 7.5s ease-in-out infinite; }

      @keyframes hiw-ring {
        0% { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(2); opacity: 0; }
      }
      .hiw-ring { animation: hiw-ring 1.6s ease-out infinite; }

      @keyframes hiw-timer {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
      .hiw-timer { animation: hiw-timer 5.5s linear both; }

      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }
        .hiw-reveal { opacity: 1; transform: none; transition: none; }
        .hiw-fade, .hiw-float, .hiw-float-slow, .hiw-ring, .hiw-timer {
          animation: none;
        }
      }
    `}</style>
  );
}
