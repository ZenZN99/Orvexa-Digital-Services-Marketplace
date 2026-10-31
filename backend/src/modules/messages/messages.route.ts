import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { MessagesController } from "./messages.controller";
import { ProtectedMiddleware } from "../../config/middlewares/protected.middleware";
import type { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";

export class MessagesRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: MessagesController,
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
      "/api/messages/:contractId",
      this.controller.create,
      protectedMiddleware.auth(),
    );

    this.bob.spongGet(
      "/api/messages",
      this.controller.findAll,
      protectedMiddleware.auth(),
      protectedMiddleware.admin(),
    );

    this.bob.spongGet(
      "/api/messages/:contractId",
      this.controller.findMe,
      protectedMiddleware.auth(),
    );

    this.bob.spongDelete(
      "/api/messages/:messageId",
      this.controller.delete,
      protectedMiddleware.auth(),
    );
  }
}
