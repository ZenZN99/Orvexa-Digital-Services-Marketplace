import type { SpongMiddleware, SpongRequest } from "riser-bob";
import { UserRole } from "../../modules/users/schemas/enums/users.enum";


const isUserRole = (role: unknown): role is UserRole =>
  Object.values(UserRole).some((value) => value === role);

export class RolesMiddleware {
  allow(...allowedRoles: UserRole[]): SpongMiddleware<SpongRequest> {
    return async (spongReq, spongRes, spongNext) => {
      const user = spongReq.user;

      if (!user) {
        return spongRes.SpongUnauthorized({
          success: false,
          message: "You are not authenticated",
        });
      }

      if (!isUserRole(user.role) || !allowedRoles.includes(user.role)) {
        return spongRes.SpongForbidden({
          success: false,
          message: "You don't have permission to access this resource",
        });
      }

      return spongNext();
    };
  }
}
