import { UserRole } from "@/app/types/user";

export const isImageFile = (file: File) => file.type.startsWith("image/");

export function formatTime(date?: Date | string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function isStaff(role?: UserRole) {
  return role === UserRole.ADMIN || role === UserRole.SUPPORT;
}


export const roleConfig: Record<
  UserRole,
  { label: string; className: string }
> = {
  [UserRole.ADMIN]: {
    label: "Admin",
    className: "bg-purple-500/10 text-purple-400",
  },
  [UserRole.SUPPORT]: {
    label: "Support",
    className: "bg-brand-green/10 text-brand-green",
  },
  [UserRole.FREELANCER]: {
    label: "Freelancer",
    className: "bg-blue-500/10 text-blue-400",
  },
  [UserRole.CLIENT]: {
    label: "Client",
    className: "bg-white/8 text-white/50",
  },
};
