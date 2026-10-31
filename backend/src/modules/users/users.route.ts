import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { UsersController } from "./users.controller";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import type { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import { ProtectedMiddleware } from "../../config/middlewares/protected.middleware";

export class UsersRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: UsersController,
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

    // Public routes
    this.bob.spongGet("/api/users", this.controller.findAll);
    this.bob.spongGet("/api/users/:id", this.controller.findOne);

    // Protected routes

    this.bob.spongPatch(
      "/api/users/:id",
      this.controller.updateRole,
      protectedMiddleware.auth(),
      protectedMiddleware.admin(),
    );

    this.bob.spongDelete(
      "/api/users/:id",
      this.controller.block,
      protectedMiddleware.auth(),
      protectedMiddleware.admin(),
    );
  }
}
