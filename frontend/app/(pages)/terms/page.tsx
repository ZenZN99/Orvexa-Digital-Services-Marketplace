"use client";
import Link from "next/link";
import {
  AlertTriangle,
  FileText,
  Gavel,
  Handshake,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const sections = [
  {
    icon: UserCheck,
    title: "Using Orvexa",
    content:
      "By creating an account or using Orvexa, you agree to use the platform lawfully and responsibly. You are responsible for the information you provide and for activity performed through your account.",
  },
  {
    icon: FileText,
    title: "Accounts",
    content:
      "You must provide accurate information when creating your account and keep your account information up to date. You are responsible for maintaining the security of your account credentials and for activity associated with your account.",
  },
  {
    icon: Handshake,
    title: "Services and transactions",
    content:
      "Orvexa provides a platform that allows users to discover, offer, and purchase services. Agreements and transactions between users are subject to the terms displayed on the platform and the applicable rules of Orvexa.",
  },
  {
    icon: ShieldCheck,
    title: "Identity verification",
    content:
      "Orvexa may offer identity verification features to improve platform safety and trust. Users must provide genuine information and must not submit another person's identity documents or misleading information.",
  },
  {
    icon: AlertTriangle,
    title: "Prohibited activities",
    content:
      "Users may not use Orvexa for illegal activities, fraud, impersonation, harassment, abuse, malicious activity, unauthorized access, or any activity that could harm other users or the platform.",
  },
  {
    icon: Gavel,
    title: "Content and conduct",
    content:
      "You are responsible for content you publish or send through Orvexa. Content must not violate applicable laws or infringe the rights of other people. Orvexa may take action when content or behavior violates platform rules.",
  },
  {
    icon: ShieldCheck,
    title: "Platform safety",
    content:
      "We may take reasonable measures to protect Orvexa and its users, including reviewing suspicious activity, restricting accounts, removing content, or temporarily limiting access when necessary to protect the platform.",
  },
  {
    icon: FileText,
    title: "Account suspension or termination",
    content:
      "Accounts may be restricted, suspended, or terminated when there is a violation of these terms, applicable law, or serious risk to the security or integrity of the platform.",
  },
];

export default function Terms() {
  return (
    <main className="min-h-screen bg-brand-navy pt-20 text-white">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-green/20 bg-brand-green/10 shadow-[0_0_40px_rgba(0,220,130,0.06)]">
            <FileText
              size={29}
              strokeWidth={1.6}
              className="text-brand-green"
            />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-green">
            Legal
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Terms of Service
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/40 sm:text-base">
            These terms describe the rules and responsibilities that apply when
            using Orvexa and its services.
          </p>

          <p className="mt-4 text-[11px] text-white/25">
            Last updated: September 23, 2026
          </p>
        </header>

        {/* Important notice */}
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-amber-400/15 bg-amber-400/4 p-5">
          <div className="flex gap-3">
            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0 text-amber-400"
            />

            <div>
              <h2 className="text-sm font-semibold text-amber-300">
                Please read these terms carefully
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-white/40">
                By accessing or using Orvexa, you acknowledge that you have read
                and agree to these terms. If you do not agree with them, please
                do not use the platform.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="mt-6 space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <section
                key={section.title}
                className="rounded-3xl border border-white/[0.07] bg-brand-navy/15 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/3">
                    <Icon
                      size={19}
                      strokeWidth={1.6}
                      className="text-brand-green"
                    />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold sm:text-lg">
                      {section.title}
                    </h2>

                    <p className="mt-2.5 text-sm leading-7 text-white/45">
                      {section.content}
                    </p>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* User responsibilities */}
        <section className="mt-4 rounded-3xl border border-white/[0.07] bg-brand-navy/15 p-5 shadow-xl shadow-black/10 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/3">
              <Handshake size={18} className="text-brand-green" />
            </div>

            <h2 className="text-lg font-semibold">Your responsibilities</h2>
          </div>

          <div className="mt-5 space-y-3">
            {[
              "Keep your account information accurate and secure.",
              "Respect other users and communicate professionally.",
              "Only publish services and content that you have the right to provide.",
              "Do not attempt to manipulate ratings, reviews, payments, or platform systems.",
              "Do not use Orvexa to conduct illegal or fraudulent activities.",
              "Follow all applicable laws and regulations when using the platform.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 text-sm leading-6 text-white/45"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mt-4 rounded-3xl border border-white/[0.07] bg-brand-navy/15 p-5 sm:p-7">
          <h2 className="text-lg font-semibold">Platform availability</h2>

          <p className="mt-3 text-sm leading-7 text-white/45">
            Orvexa may change, suspend, or discontinue features from time to
            time. We aim to keep the platform available and reliable, but we
            cannot guarantee that every feature will always be available,
            uninterrupted, or free from errors.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-4 rounded-3xl border border-white/[0.07] bg-brand-navy/15 p-6 text-center sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-white/3">
            <Mail size={20} className="text-brand-green" />
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            Questions about these terms?
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
            If you have questions about these terms or how Orvexa operates,
            please contact our support team.
          </p>

          <Link
            href="/support"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:brightness-110"
          >
            <Mail size={15} />
            Contact support
          </Link>
        </section>

        {/* Draft notice */}
        <p className="mx-auto mt-8 max-w-2xl text-center text-[11px] leading-5 text-white/20">
          These terms are currently a product draft and should be reviewed and
          finalized according to the laws and regulations applicable to Orvexa
          before public launch.
        </p>
      </div>
    </main>
  );
}
