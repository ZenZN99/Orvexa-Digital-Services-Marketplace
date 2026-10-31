"use client";

import { IFreelancer } from "@/app/types/freelancer";

export default function SkillsField({
  freelancer,
}: {
  freelancer: IFreelancer | null;
}) {
  return (
    <div className="rounded-4xl border border-white/8 bg-white/2.5 p-6 backdrop-blur-xl sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
        Expertise
      </p>

      <h2 className="mt-2 text-xl font-semibold">Skills & technologies</h2>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {freelancer?.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-xl border border-white/8 bg-white/[0.035] px-3.5 py-2 text-sm font-medium text-white/65 transition hover:border-brand-green/20  hover:text-white"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
