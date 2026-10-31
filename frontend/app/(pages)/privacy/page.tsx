"use client";
import Link from "next/link";
import {
  Database,
  Eye,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "Information we collect",
    content:
      "When you use Orvexa, we may collect information you provide when creating an account, completing your profile, publishing services, communicating with other users, or using platform features.",
  },
  {
    icon: UserRound,
    title: "Account information",
    content:
      "Your account may include information such as your name, email address, profile information, profile image, and other information you choose to provide.",
  },
  {
    icon: Eye,
    title: "How we use your information",
    content:
      "Information may be used to provide and improve Orvexa, operate your account, personalize your experience, communicate with you, maintain platform security, and prevent abuse or fraudulent activity.",
  },
  {
    icon: ShieldCheck,
    title: "Identity verification",
    content:
      "If you choose to verify your identity, you may be asked to provide identity-related information or documents. Verification information should only be used for identity verification and platform safety purposes.",
  },
  {
    icon: LockKeyhole,
    title: "Data security",
    content:
      "We take reasonable technical and organizational measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no online service can guarantee absolute security.",
  },
  {
    icon: FileText,
    title: "Information you share",
    content:
      "Information you make publicly available through your profile, services, reviews, or other platform features may be visible to other users. Please avoid sharing sensitive personal information publicly.",
  },
  {
    icon: Mail,
    title: "Communication",
    content:
      "We may use your contact information to send important account, security, service, or platform-related communications.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-navy pt-20 text-white">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-green/20 bg-brand-green/10 shadow-[0_0_40px_rgba(0,220,130,0.06)]">
            <LockKeyhole
              size={29}
              strokeWidth={1.6}
              className="text-brand-green"
            />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-green">
            Privacy
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/40 sm:text-base">
            We respect your privacy and are committed to being transparent about
            how information is collected, used, and protected on Orvexa.
          </p>

          <p className="mt-4 text-[11px] text-white/25">
            Last updated: September 23, 2026
          </p>
        </header>

        {/* Notice */}
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-brand-green/15 bg-brand-green/4 p-5">
          <div className="flex gap-3">
            <ShieldCheck
              size={19}
              className="mt-0.5 shrink-0 text-brand-green"
            />

            <div>
              <h2 className="text-sm font-semibold text-brand-green">
                Your privacy matters
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-white/40">
                This page explains the general privacy practices of Orvexa. The
                policy may be updated as the platform evolves and new features
                are introduced.
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

        {/* Your choices */}
        <section className="mt-4 rounded-3xl border border-white/[0.07] bg-brand-navy/15 p-5 shadow-xl shadow-black/10 sm:p-7">
          <h2 className="text-lg font-semibold">Your privacy choices</h2>

          <div className="mt-5 space-y-3">
            {[
              "Review and update your account information.",
              "Control what information you choose to make publicly visible.",
              "Contact Orvexa regarding privacy-related questions.",
              "Request information about how your personal data is handled.",
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

        {/* Contact */}
        <section className="mt-4 rounded-3xl border border-white/7 bg-brand-navy/15 p-6 text-center sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-white/3">
            <Mail size={20} className="text-brand-green" />
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            Questions about privacy?
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
            If you have questions or concerns about privacy on Orvexa, please
            contact our support team.
          </p>

          <Link
            href="/support"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:brightness-110"
          >
            <Mail size={15} />
            Contact privacy team
          </Link>
        </section>

        {/* Footer note */}
        <p className="mx-auto mt-8 max-w-2xl text-center text-[11px] leading-5 text-white/20">
          This privacy policy is currently a product draft and should be
          reviewed and finalized according to the legal requirements applicable
          to Orvexa before the platform is launched publicly.
        </p>
      </div>
    </main>
  );
}
