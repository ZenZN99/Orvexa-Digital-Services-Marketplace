"use client";
import { useMemo } from "react";
import getPasswordStrength from "./GetPasswordStrength";
import { PASSWORD_REQUIREMENTS } from "../constants/register.constant";
import { Check } from "lucide-react";

export default function PasswordStrengthMeter({
  password,
}: {
  password: string;
}) {
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="mt-2.5">
      {/* Bar */}
      <div className="flex items-center gap-3">
        <div className="flex h-1 flex-1 gap-1">
          {PASSWORD_REQUIREMENTS.map((_, i) => (
            <span
              key={i}
              className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                i < strength.score ? strength.barColor : "bg-white/8"
              }`}
            />
          ))}
        </div>

        <span
          className={`shrink-0 text-[10px] font-semibold transition-colors duration-300 ${strength.textColor}`}
        >
          {strength.label}
        </span>
      </div>

      {/* Requirement chips */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {PASSWORD_REQUIREMENTS.map((req) => {
          const met = req.test(password);

          return (
            <span
              key={req.key}
              className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-medium transition-colors duration-300 ${
                met
                  ? "bg-brand-green/10 text-brand-green"
                  : "bg-white/3 text-white/25"
              }`}
            >
              {met && <Check size={9} strokeWidth={3} />}
              {req.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
