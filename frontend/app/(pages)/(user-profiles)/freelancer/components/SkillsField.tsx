"use client";

import { IUser } from "@/app/types/user";
import { Check } from "lucide-react";
import { EditForm } from "./JobTitleField";
import { Skills } from "@/app/types/freelancer";

interface SkillsProps {
  isEditing: boolean;
  user: IUser;
  editForm: EditForm;
  toggleSkill: (skill: Skills) => void;
}

export default function SkillsField({
  isEditing,
  user,
  editForm,
  toggleSkill,
}: SkillsProps) {
  return (
    <div className="rounded-4xl border border-white/8 bg-white/2.5 p-6 backdrop-blur-xl sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
        Expertise
      </p>

      <h2 className="mt-2 text-xl font-semibold">Skills & technologies</h2>

      {!isEditing ? (
        <div className="mt-6 flex flex-wrap gap-2.5">
          {user.freelancer.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-xl border border-white/8 bg-white/[0.035] px-3.5 py-2 text-sm font-medium text-white/65"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap gap-2.5">
          {Object.values(Skills).map((skill) => {
            const selected = editForm.skills.includes(skill);

            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
                  selected
                    ? "border-brand-green/30 bg-brand-green/10 text-brand-green"
                    : "border-white/8 bg-white/2.5 text-white/45 hover:bg-white/5 hover:text-white"
                }`}
              >
                {selected && <Check size={14} />}
                {skill}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
