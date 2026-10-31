import { UserRole } from "@/app/types/user";

export function formatRole(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return "admin";

    case UserRole.SUPPORT:
      return "support";

    case UserRole.FREELANCER:
      return "freelancer";

    case UserRole.CLIENT:
      return "client";

    default:
      return role;
  }
}
