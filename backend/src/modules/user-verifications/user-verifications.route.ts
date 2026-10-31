import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { UserVerificationsController } from "./user-verifications.controller";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import type { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import { ProtectedMiddleware } from "../../config/middlewares/protected.middleware";

export class UserVerificationsRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: UserVerificationsController,
    private readonly authMiddleware: AuthMiddleware,
    private readonly userActiveMiddleware: UserActiveMiddleware,
    private readonly rolesMiddleware: RolesMiddleware,
  ) {}

  register(): void {
    const protectedMiddleware = new ProtectedMiddleware(
      this.authMiddleware,
      this.userActiveMiddleware,
      this.rolesMiddleware,
    );

    // Protected routes

    this.bob.spongPost(
      "/api/user-verifications",
      this.controller.create,
      protectedMiddleware.auth(),
    );

    this.bob.spongGet(
      "/api/user-verifications/pending",
      this.controller.findPending,
      protectedMiddleware.auth(),
    );

    this.bob.spongPost(
      "/api/user-verifications/try-again",
      this.controller.tryAgain,
      protectedMiddleware.auth(),
    );

    this.bob.spongPatch(
      "/api/user-verifications/:verificationId/status",
      this.controller.update,
      protectedMiddleware.auth(),
      protectedMiddleware.admin(),
    );
  }
}
