import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { SupportMessagesController } from "./support-messages.controller";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import type { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import { ProtectedMiddleware } from "../../config/middlewares/protected.middleware";

export class SupportMessagesRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: SupportMessagesController,
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
      "/api/support-messages/:conversationId",
      this.controller.create,
      protectedMiddleware.auth(),
    );

    this.bob.spongGet(
      "/api/support-messages/:conversationId",
      this.controller.findAll,
      protectedMiddleware.auth(),
    );

    this.bob.spongPatch(
      "/api/support-messages/:conversationId",
      this.controller.markAllAsRead,
      protectedMiddleware.auth(),
    );

    this.bob.spongDelete(
      "/api/support-messages/:conversationId/:messageId",
      this.controller.delete,
      protectedMiddleware.auth(),
      protectedMiddleware.adminAndSupport(),
    );
  }
}
