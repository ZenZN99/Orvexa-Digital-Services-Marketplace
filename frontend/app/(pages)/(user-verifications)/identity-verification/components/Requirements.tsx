"use client";

import { ShieldCheck } from "lucide-react";
import Requirement from "./Requirement";

export default function Requirements() {
  return (
    <section className="mt-6 rounded-3xl border border-white/[0.07] bg-white/1.5 p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <ShieldCheck size={18} className="text-brand-green" />

        <h2 className="text-sm font-semibold">Verification requirements</h2>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Requirement text="Your face must be clearly visible." />
        <Requirement text="Use a well-lit environment." />
        <Requirement text="Do not use blurry or heavily edited photos." />
        <Requirement text="Your identity document must be readable." />
        <Requirement text="All corners of the document should be visible." />
        <Requirement text="Do not cover important information with your hand." />
      </div>
    </section>
  );
}
