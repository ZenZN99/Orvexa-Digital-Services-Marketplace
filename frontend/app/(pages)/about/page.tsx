"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"] });

const features = [
  {
    icon: Sparkles,
    title: "Find the right service",
    text: "Discover professional services from freelancers with the skills your project needs.",
  },
  {
    icon: MessageSquare,
    title: "Work together",
    text: "Communicate with freelancers and keep your project organized in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Work with confidence",
    text: "Structured orders, contracts, and payments make the process clear for everyone.",
  },
];

const clientSteps = [
  "Discover a service",
  "Choose a freelancer",
  "Place an order",
  "Work together",
  "Complete the project",
];

const freelancerSteps = [
  "Create your service",
  "Get discovered",
  "Receive orders",
  "Deliver your work",
  "Build your reputation",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-10 bg-brand-navy text-white">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:px-10 sm:pt-24 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">
            About Orvexa
          </p>

          <h1
            className={`${display.className} mt-5 text-5xl font-bold leading-none tracking-[-0.04em] sm:text-6xl lg:text-7xl`}
          >
            Where great work finds great people.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/50">
            Orvexa is a freelance marketplace that connects clients with
            talented independent professionals and makes it easier to discover,
            manage, and complete projects.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-green px-6 text-sm font-semibold text-brand-navy transition hover:brightness-110"
            >
              Explore services
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/create-service"
              className="inline-flex h-11 items-center rounded-lg border border-white/10 px-6 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white"
            >
              Start selling
            </Link>
          </div>
        </div>
      </section>

      {/* What is Orvexa */}
      <section className="border-y border-white/[0.07]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">
              Our mission
            </p>

            <h2
              className={`${display.className} mt-3 text-3xl font-bold tracking-tight sm:text-4xl`}
            >
              Making professional work easier to find and easier to deliver.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/45">
              Clients need a simple way to find the right talent. Freelancers
              need a place to showcase their skills and manage their work.
              Orvexa brings both sides together in one focused marketplace.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/8 bg-white/2 p-6"
                >
                  <Icon size={22} className="text-brand-green" />

                  <h3 className="mt-5 font-semibold">{feature.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* For both sides */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">
            Built for both sides
          </p>

          <h2
            className={`${display.className} mt-3 text-3xl font-bold tracking-tight sm:text-4xl`}
          >
            One marketplace. Two simple experiences.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/2 p-7">
            <Users size={22} className="text-brand-green" />

            <h3 className="mt-5 text-xl font-semibold">For clients</h3>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Find professionals, compare services, place orders, and manage
              your projects from one place.
            </p>

            <ul className="mt-6 space-y-3">
              {clientSteps.map((step) => (
                <li
                  key={step}
                  className="flex items-center gap-3 text-sm text-white/55"
                >
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-brand-green"
                  />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/2 p-7">
            <BriefcaseBusiness size={22} className="text-brand-green" />

            <h3 className="mt-5 text-xl font-semibold">For freelancers</h3>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Showcase your skills, attract clients, manage orders, and grow
              your reputation through real work.
            </p>

            <ul className="mt-6 space-y-3">
              {freelancerSteps.map((step) => (
                <li
                  key={step}
                  className="flex items-center gap-3 text-sm text-white/55"
                >
                  <CheckCircle2
                    size={16}
                    className="shrink-0 text-brand-green"
                  />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Simple workflow */}
      <section className="border-y border-white/[0.07]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-green">
              How it works
            </p>

            <h2
              className={`${display.className} mt-3 text-3xl font-bold tracking-tight sm:text-4xl`}
            >
              From discovery to delivery.
            </h2>

            <p className="mt-4 text-base leading-7 text-white/45">
              Orvexa keeps the process straightforward, so both clients and
              freelancers know what comes next.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {["Discover", "Connect", "Order", "Deliver", "Complete"].map(
              (step, index) => (
                <div
                  key={step}
                  className="rounded-xl border border-white/8 bg-white/2 p-5"
                >
                  <span className="text-xs font-semibold text-brand-green">
                    0{index + 1}
                  </span>

                  <h3 className="mt-3 font-semibold">{step}</h3>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-10 lg:px-12">
        <div className="rounded-2xl border border-brand-green/15 bg-brand-green/4 p-8 sm:p-12">
          <h2
            className={`${display.className} max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl`}
          >
            Ready to get started?
          </h2>

          <p className="mt-4 max-w-xl text-base leading-7 text-white/45">
            Find the right service for your next project or start offering your
            skills to clients.
          </p>

          <Link
            href="/services"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-lg bg-brand-green px-6 text-sm font-semibold text-brand-navy transition hover:brightness-110"
          >
            Explore services
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-7 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
          <p>© {new Date().getFullYear()} Orvexa. All rights reserved.</p>

          <div className="flex gap-5">
            <Link href="/services" className="transition hover:text-white">
              Services
            </Link>

            <Link href="/about" className="text-white/55">
              About
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
