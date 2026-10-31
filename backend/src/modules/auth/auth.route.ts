import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { AuthController } from "./auth.controller";
import type { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";

export class AuthRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: AuthController,
    private readonly authMiddleware: AuthMiddleware,
    private readonly userActiveMiddleware: UserActiveMiddleware,
  ) {}

  register(): void {
    // Public routes
    this.bob.spongPost("/api/auth/register", this.controller.register);
    this.bob.spongPost("/api/auth/login", this.controller.login);
    this.bob.spongPost("/api/auth/refreshToken", this.controller.refreshToken);

    // Protected routes
    this.bob.spongPost(
      "/api/auth/logout",
      this.controller.logout,
      this.authMiddleware.middleware,
    );

    this.bob.spongGet(
      "/api/auth/me",
      this.controller.me,
      this.authMiddleware.middleware,
      this.userActiveMiddleware.middleware,
    );
  }
}
