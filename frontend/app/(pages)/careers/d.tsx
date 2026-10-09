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
  ArrowUpRight,
  Briefcase,
  ChevronDown,
  Code2,
  Database,
  Globe2,
  HeartHandshake,
  LifeBuoy,
  MapPin,
  MessageSquare,
  Palette,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Content (edit this section to manage the page)                            */
/* -------------------------------------------------------------------------- */

// Where applications are sent. Change this to your real address.
const CAREERS_EMAIL = "careers@orvexa.com";

type Team = "Engineering" | "Design" | "Operations";

interface Role {
  id: string;
  title: string;
  team: Team;
  type: string;
  location: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

// Add, remove, or empty this array. An empty list shows a friendly
// "no open roles" state with a general application option.
const roles: Role[] = [
  {
    id: "frontend-engineer",
    title: "Frontend Engineer",
    team: "Engineering",
    type: "Full-time",
    location: "Remote",
    summary:
      "Build the marketplace experience clients and freelancers use every day.",
    responsibilities: [
      "Build and polish pages and components with Next.js, React, and Tailwind CSS",
      "Connect the interface to real-time features such as chat and notifications",
      "Keep the admin dashboard fast, clear, and reliable",
    ],
    requirements: [
      "Strong experience with React and TypeScript",
      "An eye for detail in layout, motion, and accessibility",
      "Comfort working with REST APIs and client-side state",
    ],
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    team: "Engineering",
    type: "Full-time",
    location: "Remote",
    summary:
      "Own the logic behind orders, payments, contracts, and everything in between.",
    responsibilities: [
      "Design and ship NestJS modules with clean, testable business logic",
      "Keep money flows safe with transactions, locking, and background jobs",
      "Improve performance with caching and queue-based processing",
    ],
    requirements: [
      "Solid experience with Node.js, TypeScript, and relational databases",
      "Care for correctness where money and state changes are involved",
      "Habit of writing tests alongside your code",
    ],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    team: "Design",
    type: "Full-time",
    location: "Remote",
    summary:
      "Shape how people discover services, hire talent, and follow their work.",
    responsibilities: [
      "Design end-to-end flows from first visit to completed contract",
      "Create consistent components and motion for a dark, modern interface",
      "Work closely with engineers to ship what you design",
    ],
    requirements: [
      "A portfolio of shipped product or marketplace design",
      "Fluency in design systems and responsive layouts",
      "Clear communication and a bias for simple solutions",
    ],
  },
  {
    id: "community-support",
    title: "Community Support Specialist",
    team: "Operations",
    type: "Part-time",
    location: "Remote",
    summary:
      "Be the human voice that helps clients and freelancers get unstuck.",
    responsibilities: [
      "Reply to support conversations quickly and kindly",
      "Review identity verifications and service submissions",
      "Spot patterns and feed what you learn back to the product team",
    ],
    requirements: [
      "Excellent written communication",
      "Patience, fairness, and good judgment",
      "Interest in freelancing and online marketplaces",
    ],
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Trust is the product",
    text: "People move real money and real work through Orvexa. We sweat the details that keep both sides safe.",
  },
  {
    icon: Sparkles,
    title: "Simple on purpose",
    text: "If a flow needs an explanation, we keep working on it until it doesn't.",
  },
  {
    icon: HeartHandshake,
    title: "Fair to both sides",
    text: "Clients and freelancers should both feel the marketplace was built for them.",
  },
  {
    icon: Rocket,
    title: "Ship, learn, improve",
    text: "We release small, listen closely, and keep making the product better.",
  },
];

const perks = [
  { icon: Globe2, title: "Remote-first", text: "Work from wherever you do your best thinking." },
  { icon: Zap, title: "Real ownership", text: "Small team, big surface. Your work ships and gets used." },
  { icon: Workflow, title: "Modern stack", text: "A clean, modular codebase you'll enjoy working in." },
  { icon: Users, title: "Direct collaboration", text: "No layers. You talk to the people building with you." },
];

const stack = [
  { icon: Code2, layer: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand"] },
  { icon: Database, layer: "Backend", items: ["NestJS", "PostgreSQL", "Sequelize", "JWT auth"] },
  { icon: Workflow, layer: "Infrastructure", items: ["Redis", "BullMQ", "Socket.IO"] },
];

const process = [
  { icon: MessageSquare, title: "Apply", text: "Send your CV or portfolio and tell us why Orvexa." },
  { icon: Search, title: "Intro chat", text: "A relaxed conversation about you, the role, and the team." },
  { icon: Briefcase, title: "Practical task", text: "A small, realistic challenge related to the work you'd do." },
  { icon: Rocket, title: "Offer", text: "A quick decision and a clear, friendly offer." },
];

const teamIcons: Record<Team, typeof Code2> = {
  Engineering: Code2,
  Design: Palette,
  Operations: LifeBuoy,
};

const faqs = [
  {
    q: "Do I need to live in a specific country?",
    a: "No. Orvexa is remote-first, so what matters is your skills and how well we can work together.",
  },
  {
    q: "What if there's no role for me?",
    a: "Send a general application anyway. Tell us what you do best and how you'd help, and we'll keep it on file for when something opens up.",
  },
  {
    q: "How long does the process take?",
    a: "We aim to keep it quick and respectful of your time: an intro chat, one practical task, and a decision.",
  },
  {
    q: "Do you hire freelancers?",
    a: "Yes. Some of our work is a great fit for freelancers, and that's something we understand well.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                     */
/* -------------------------------------------------------------------------- */

function mailto(subject: string) {
  return `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function CareersPage() {
  return (
    <main className="overflow-x-clip bg-brand-navy text-white">
      <PageStyles />

      <Hero />
      <Values />
      <Openings />
      <Perks />
      <Stack />
      <Process />
      <Faq />
      <Closing />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

function Hero() {
  const highlights = [
    { value: `${roles.length}`, label: "Open roles" },
    { value: "Remote", label: "First" },
    { value: "2", label: "Sides, one marketplace" },
  ];

  return (
    <section className="relative">
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
      <div className="car-glow pointer-events-none absolute -top-24 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand-green/15 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-20 text-center sm:px-10 sm:pb-24 sm:pt-28">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-brand-green/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-green">
            <Sparkles size={12} />
            Careers at Orvexa
          </span>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl sm:leading-[1.05]">
            Help us build where{" "}
            <span className="text-brand-green">great work finds great people.</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
            We&apos;re building a freelance marketplace that&apos;s simple, fair, and
            safe for everyone who uses it. Join a small team where your work
            ships fast and matters.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#openings"
              className="group flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-green px-6 text-sm font-semibold text-brand-navy transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_-6px_rgba(0,220,130,0.7)]"
            >
              See open roles
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

            <Link
              href="/about"
              className="flex h-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-6 text-sm font-semibold text-white/80 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.07]"
            >
              About Orvexa
            </Link>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-white/[0.03] py-5">
            {highlights.map((item) => (
              <div key={item.label} className="px-3">
                <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {item.value}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-white/35">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Values                                                                    */
/* -------------------------------------------------------------------------- */

function Values() {
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.015] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <SectionHeading
          eyebrow="What we care about"
          title="How we work, and what we believe."
          text="The principles behind every decision, from a button label to a payment flow."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <Card icon={item.icon} title={item.title} text={item.text} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Openings                                                                  */
/* -------------------------------------------------------------------------- */

function Openings() {
  const teams: ("All" | Team)[] = [
    "All",
    ...Array.from(new Set(roles.map((role) => role.team))),
  ];

  const [team, setTeam] = useState<"All" | Team>("All");
  const [open, setOpen] = useState<string | null>(roles[0]?.id ?? null);

  const visible = roles.filter((role) => team === "All" || role.team === team);

  return (
    <section id="openings" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        <SectionHeading
          eyebrow="Open roles"
          title="Find your place on the team."
          text="Click a role to see what you'd do and what we're looking for."
        />

        {roles.length > 0 && (
          <Reveal>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {teams.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTeam(item)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
                    team === item
                      ? "border-brand-green bg-brand-green text-brand-navy"
                      : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <div className="mt-10 space-y-3">
          {visible.map((role, index) => {
            const isOpen = open === role.id;
            const TeamIcon = teamIcons[role.team];

            return (
              <div
                key={role.id}
                className="car-pop"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-brand-green/30 bg-brand-green/[0.04]"
                      : "border-white/[0.07] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : role.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 p-5 text-left"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                        isOpen
                          ? "bg-brand-green text-brand-navy"
                          : "bg-brand-green/10 text-brand-green"
                      }`}
                    >
                      <TeamIcon size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold">{role.title}</h3>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
                        <span>{role.team}</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {role.location}
                        </span>
                        <span>{role.type}</span>
                      </div>
                    </div>

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
                      <div className="border-t border-white/[0.07] px-5 pb-6 pt-5">
                        <p className="text-sm leading-7 text-white/60">
                          {role.summary}
                        </p>

                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                          <BulletList
                            title="What you'll do"
                            items={role.responsibilities}
                          />
                          <BulletList
                            title="What we're looking for"
                            items={role.requirements}
                          />
                        </div>

                        <a
                          href={mailto(`Application: ${role.title}`)}
                          className="group mt-7 inline-flex h-10 items-center gap-2 rounded-lg bg-brand-green px-5 text-sm font-semibold text-brand-navy transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_26px_-6px_rgba(0,220,130,0.7)]"
                        >
                          Apply for this role
                          <ArrowUpRight
                            size={15}
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {roles.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
              <p className="text-base font-semibold">
                No open roles right now.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
                We&apos;re always happy to hear from talented people. Send a
                general application and we&apos;ll reach out when something fits.
              </p>
            </div>
          )}
        </div>

        <Reveal>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-semibold">Don&apos;t see your role?</p>
              <p className="mt-1 text-xs leading-5 text-white/45">
                Tell us what you&apos;re great at and how you&apos;d help Orvexa grow.
              </p>
            </div>

            <a
              href={mailto("General application")}
              className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white/85 transition-all duration-300 hover:border-brand-green/40 hover:bg-brand-green/10 hover:text-brand-green"
            >
              Send a general application
              <ArrowRight size={14} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
        {title}
      </p>

      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-6 text-white/60"
          >
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-brand-green" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Perks                                                                     */
/* -------------------------------------------------------------------------- */

function Perks() {
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.015] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <SectionHeading
          eyebrow="Life at Orvexa"
          title="A place where good work is easy to do."
          text="Less overhead, more building."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <Card icon={item.icon} title={item.title} text={item.text} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stack                                                                     */
/* -------------------------------------------------------------------------- */

function Stack() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <SectionHeading
          eyebrow="Our stack"
          title="Tools we build with."
          text="A modern, modular stack that's a pleasure to work in."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {stack.map((group, index) => {
            const Icon = group.icon;

            return (
              <Reveal key={group.layer} delay={index * 100}>
                <div className="group h-full rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/25">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green transition-transform duration-300 group-hover:scale-110">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-sm font-semibold">{group.layer}</h3>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/65 transition-colors duration-300 hover:border-brand-green/30 hover:text-brand-green"
                      >
                        {item}
                      </span>
                    ))}
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
/*  Process                                                                   */
/* -------------------------------------------------------------------------- */

function Process() {
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.015] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <SectionHeading
          eyebrow="Hiring process"
          title="Simple, fast, and respectful."
          text="Four steps from hello to offer."
        />

        <div className="relative mt-14 grid gap-6 md:grid-cols-4">
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />

          {process.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={item.title} delay={index * 110}>
                <div className="group relative flex flex-col items-center text-center">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-brand-navy text-white/50 transition-all duration-300 group-hover:scale-110 group-hover:border-brand-green group-hover:text-brand-green group-hover:shadow-[0_0_26px_-4px_rgba(0,220,130,0.6)]">
                    <Icon size={20} />

                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-brand-navy">
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-sm font-semibold">{item.title}</h3>

                  <p className="mt-2 max-w-[14rem] text-xs leading-5 text-white/45">
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
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Before you apply."
          text="A few quick answers."
        />

        <div className="mt-10 space-y-3">
          {faqs.map((item, index) => {
            const isOpen = open === index;

            return (
              <Reveal key={item.q} delay={index * 60}>
                <div
                  className={`rounded-2xl border transition-colors duration-300 ${
                    isOpen
                      ? "border-brand-green/25 bg-brand-green/[0.04]"
                      : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
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
/*  Closing CTA                                                               */
/* -------------------------------------------------------------------------- */

function Closing() {
  return (
    <section className="relative bg-brand-navy pb-20 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-green px-6 py-12 text-center sm:px-10 sm:py-14">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[90px]" />
            <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-20 -right-16 h-48 w-48 rounded-full border border-white/10" />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-brand-navy sm:text-4xl">
                Ready to build something that matters?
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-brand-navy/70 sm:text-base">
                Whether you see your role above or not, we&apos;d love to hear
                from you.
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#openings"
                  className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-navy px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand-navy/90 sm:w-auto"
                >
                  Browse open roles
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>

                <a
                  href={mailto("General application")}
                  className="flex h-11 w-full items-center justify-center rounded-lg border border-brand-navy/25 px-6 text-sm font-semibold text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white sm:w-auto"
                >
                  Send your CV
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared UI                                                                 */
/* -------------------------------------------------------------------------- */

function Card({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Code2;
  title: string;
  text: string;
}) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-green/25 hover:bg-white/[0.04]">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-green/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
        <Icon size={20} strokeWidth={1.7} />
      </div>

      <h3 className="relative mt-5 text-base font-semibold">{title}</h3>

      <p className="relative mt-2 text-sm leading-6 text-white/50">{text}</p>
    </div>
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
}: {
  children: ReactNode;
  delay?: number;
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
      className={`car-reveal ${shown ? "is-in" : ""}`}
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

      .car-reveal {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.7s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .car-reveal.is-in { opacity: 1; transform: none; }

      @keyframes car-pop {
        from { opacity: 0; transform: translateY(12px) scale(0.98); }
        to { opacity: 1; transform: none; }
      }
      .car-pop { animation: car-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }

      @keyframes car-glow {
        0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
        50% { opacity: 1; transform: translateX(-50%) scale(1.12); }
      }
      .car-glow { animation: car-glow 7s ease-in-out infinite; }

      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }
        .car-reveal { opacity: 1; transform: none; transition: none; }
        .car-pop, .car-glow { animation: none; }
      }
    `}</style>
  );
}