import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { OrdersController } from "./orders.controller";
import type { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import { ProtectedMiddleware } from "../../config/middlewares/protected.middleware";

export class OrdersRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: OrdersController,
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

    // Protected Routes
    this.bob.spongPost(
      "/api/orders",
      this.controller.create,
      protectedMiddleware.auth(),
      protectedMiddleware.client(),
    );

    this.bob.spongGet(
      "/api/orders",
      this.controller.findAll,
      protectedMiddleware.auth(),
      protectedMiddleware.admin(),
    );

    this.bob.spongGet(
      "/api/orders/me",
      this.controller.findMe,
      protectedMiddleware.auth(),
      protectedMiddleware.client(),
    );

    this.bob.spongGet(
      "/api/orders/:orderId",
      this.controller.findOne,
      protectedMiddleware.client(),
    );

    this.bob.spongDelete(
      "/api/orders/:orderId",
      this.controller.delete,
      protectedMiddleware.auth(),
      protectedMiddleware.client(),
    );
  }
}
