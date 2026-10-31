import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { FreelancersController } from "./freelancers.controller";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import type { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import { ProtectedMiddleware } from "../../config/middlewares/protected.middleware";

export class FreelancersRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: FreelancersController,
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
      "/api/freelancers",
      this.controller.findMe,
      protectedMiddleware.auth(),
    );

    this.bob.spongGet(
      "/api/freelancers/:id",
      this.controller.findOne,
      protectedMiddleware.auth(),
    );

    this.bob.spongPut(
      "/api/freelancers",
      this.controller.update,
      protectedMiddleware.auth(),
      protectedMiddleware.freelancer(),
    );
  }
}
