import { UserRole } from "@/app/types/user";

export const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "admin",
  [UserRole.SUPPORT]: "support",
  [UserRole.FREELANCER]: "freelancer",
  [UserRole.CLIENT]: "client",
};
