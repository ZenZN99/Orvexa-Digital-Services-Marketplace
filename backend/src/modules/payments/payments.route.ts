import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { PaymentsController } from "./payments.controller";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import type { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import { ProtectedMiddleware } from "../../config/middlewares/protected.middleware";
import type { UserVerificationMiddleware } from "../../config/middlewares/user-verification.middleware";

export class PaymentsRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: PaymentsController,
    private readonly authMiddleware: AuthMiddleware,
    private readonly userActiveMiddleware: UserActiveMiddleware,
    private readonly userVerificationMiddleware: UserVerificationMiddleware,
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
      "/api/payments/:orderId",
      this.controller.pay,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
      protectedMiddleware.client(),
    );

    this.bob.spongGet(
      "/api/payments",
      this.controller.findAll,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
      protectedMiddleware.admin(),
    );

    this.bob.spongGet(
      "/api/payments/me",
      this.controller.findMe,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
      protectedMiddleware.client(),
    );

    this.bob.spongGet(
      "/api/payments/:paymentId",
      this.controller.findOne,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
      protectedMiddleware.client(),
    );

    this.bob.spongPatch(
      "/api/payments/recharge-balance",
      this.controller.rechargeBalance,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
      protectedMiddleware.client(),
    );
  }
}
