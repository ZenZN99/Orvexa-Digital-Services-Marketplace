import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { NotificationsController } from "./notifications.controller";
import { ProtectedMiddleware } from "../../config/middlewares/protected.middleware";
import type { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";

export class NotificationsRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: NotificationsController,
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

    this.bob.spongGet(
      "/api/notifications/me",
      this.controller.findMe,
      protectedMiddleware.auth(),
    );

    this.bob.spongPatch(
      "/api/notifications/:notificationId/read",
      this.controller.markAsRead,
      protectedMiddleware.auth(),
    );

    this.bob.spongPut(
      "/api/notifications/read-all",
      this.controller.markAllAsRead,
      protectedMiddleware.auth(),
    );

    this.bob.spongDelete(
      "/api/notifications/:notificationId",
      this.controller.delete,
      protectedMiddleware.auth(),
    );
  }
}
