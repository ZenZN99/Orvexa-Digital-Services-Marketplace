"use client";

import Left from "./components/Left";
import Right from "./components/Right";
import Topics from "./components/Topics";
import ContactBanner from "./components/ContactBanner";
import FAQ from "./components/FAQ";

export default function SupportPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-brand-navy text-white">
      <section className="px-5 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-40">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Left />

            <Right />
          </div>
        </div>
      </section>

      <Topics />

      <ContactBanner />

      <FAQ />
    </main>
  );
}
