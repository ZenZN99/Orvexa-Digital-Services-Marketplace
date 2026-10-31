import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { ContractsController } from "./contracts.controller";
import type { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import { ProtectedMiddleware } from "../../config/middlewares/protected.middleware";
import type { UserVerificationMiddleware } from "../../config/middlewares/user-verification.middleware";

export class ContractsRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: ContractsController,
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
    this.bob.spongGet(
      "/api/contracts/me",
      this.controller.findMe,
      protectedMiddleware.auth(),
    );

    this.bob.spongGet(
      "/api/contracts",
      this.controller.findAll,
      protectedMiddleware.auth(),
      protectedMiddleware.admin(),
    );

    this.bob.spongGet(
      "/api/contracts/:contractId",
      this.controller.findOne,
      protectedMiddleware.auth(),
    );

    this.bob.spongPost(
      "/api/contracts/complete/:contractId",
      this.controller.complete,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
      protectedMiddleware.client(),
    );

    this.bob.spongPost(
      "/api/contracts/deliver/:contractId",
      this.controller.deliver,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
      protectedMiddleware.freelancer(),
    );
  }
}
