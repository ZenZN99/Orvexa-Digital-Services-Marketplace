import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { CartsController } from "./carts.controller";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import type { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import { ProtectedMiddleware } from "../../config/middlewares/protected.middleware";

export class CartsRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: CartsController,
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
      "/api/carts/me",
      this.controller.findMe,
      protectedMiddleware.auth(),
      protectedMiddleware.client(),
    );
    this.bob.spongPost(
      "/api/carts/:serviceId",
      this.controller.addItem,
      protectedMiddleware.auth(),
      protectedMiddleware.client(),
    );
    this.bob.spongDelete(
      "/api/carts/:serviceId",
      this.controller.removeItem,
      protectedMiddleware.auth(),
      protectedMiddleware.client(),
    );
    this.bob.spongDelete(
      "/api/carts",
      this.controller.clearCart,
      protectedMiddleware.auth(),
      protectedMiddleware.client(),
    );
  }
}
