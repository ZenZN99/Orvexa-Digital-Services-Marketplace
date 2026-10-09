import { UserRole } from "@/app/types/user";
import { BriefcaseBusiness, Users } from "lucide-react";

export type PasswordStrength = {
  score: number; // 0-4
  label: string;
  barColor: string;
  textColor: string;
};

export const ROLE_OPTIONS = [
  {
    value: UserRole.FREELANCER,
    icon: BriefcaseBusiness,
    title: "Freelancer",
    description: "Sell your skills and grow your business.",
  },
  {
    value: UserRole.CLIENT,
    icon: Users,
    title: "Client",
    description: "Find talent and hire for your services.",
  },
];

export const INPUT_CLASS =
  "h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-brand-green/35 focus:bg-white/[0.045]";

export const PASSWORD_REQUIREMENTS: {
  key: string;
  label: string;
  test: (value: string) => boolean;
}[] = [
  { key: "length", label: "8+ characters", test: (v) => v.length >= 8 },
  {
    key: "case",
    label: "Upper & lowercase",
    test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  { key: "number", label: "A number", test: (v) => /\d/.test(v) },
  {
    key: "symbol",
    label: "A symbol",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

export const STRENGTH_LEVELS: Record<
  number,
  Omit<PasswordStrength, "score">
> = {
  0: { label: "Very weak", barColor: "bg-red-500", textColor: "text-red-400" },
  1: { label: "Weak", barColor: "bg-red-500", textColor: "text-red-400" },
  2: {
    label: "Fair",
    barColor: "bg-amber-500",
    textColor: "text-amber-400",
  },
  3: {
    label: "Good",
    barColor: "bg-yellow-400",
    textColor: "text-yellow-300",
  },
  4: {
    label: "Strong",
    barColor: "bg-brand-green",
    textColor: "text-brand-green",
  },
};
