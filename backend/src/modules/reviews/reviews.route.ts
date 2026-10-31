import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { ReviewsController } from "./reviews.controller";
import { ProtectedMiddleware } from "../../config/middlewares/protected.middleware";
import type { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";

export class ReviewsRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: ReviewsController,
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
      "/api/reviews/:contractId",
      this.controller.create,
      protectedMiddleware.auth(),
      protectedMiddleware.client(),
    );

    this.bob.spongGet(
      "/api/reviews/me",
      this.controller.findMe,
      protectedMiddleware.auth(),
    );

    this.bob.spongGet(
      "/api/reviews/freelancer/:userId",
      this.controller.findByFreelancer,
      protectedMiddleware.auth(),
    );

    this.bob.spongGet(
      "/api/reviews/all/:serviceId",
      this.controller.findAllByService,
      protectedMiddleware.auth(),
    );

    this.bob.spongGet(
      "/api/reviews/all/:reviewId",
      this.controller.findOne,
      protectedMiddleware.auth(),
    );
  }
}
