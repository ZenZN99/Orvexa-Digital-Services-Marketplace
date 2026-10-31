import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { UserProfilesController } from "./user-profiles.controller";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";

export class UserProfilesRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: UserProfilesController,
    private readonly authMiddleware: AuthMiddleware,
    private readonly userActiveMiddleware: UserActiveMiddleware,
  ) {}

  register(): void {
    // Protected routes
    this.bob.spongPut(
      "/api/user-profiles",
      this.controller.update,
      this.authMiddleware.middleware,
      this.userActiveMiddleware.middleware,
    );
  }
}
