import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { SupportConversationsController } from "./support-conversations.controller";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import type { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import { ProtectedMiddleware } from "../../config/middlewares/protected.middleware";

export class SupportConversationsRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: SupportConversationsController,
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
      "/api/support-conversations",
      this.controller.create,
      protectedMiddleware.auth(),
      protectedMiddleware.freelancerAndClient(),
    );

    this.bob.spongGet(
      "/api/support-conversations",
      this.controller.findAll,
      protectedMiddleware.auth(),
      protectedMiddleware.adminAndSupport(),
    );

    this.bob.spongGet(
      "/api/support-conversations/me",
      this.controller.findMe,
      protectedMiddleware.auth(),
    );

    this.bob.spongGet(
      "/api/support-conversations/:conversationId",
      this.controller.findOne,
      protectedMiddleware.auth(),
    );

    this.bob.spongPut(
      "/api/support-conversations/:conversationId",
      this.controller.toggle,
      protectedMiddleware.auth(),
      protectedMiddleware.admin(),
    );
  }
}
