import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { AuthController } from "./auth.controller";
import { AuthRouter } from "./auth.route";
import { UserSchema } from "../users/schemas/user.schema";
import { TokenManager } from "../../config/token/token";
import { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import { UserProfileSchema } from "../user-profiles/schemas/user-profile.schema";
import { FreelancerSchema } from "../freelancers/schemas/freelancer.schema";
import { UserVerificationSchema } from "../user-verifications/schemas/user-verification.schema";
import { verifyUser } from "../../config/token/verify-user";
import { AuthService } from "./auth.service";

export class AuthModule {
  register(bob: RiserBob): void {
    const tokenManager = new TokenManager();

    const service = new AuthService(
      UserSchema,
      UserProfileSchema,
      FreelancerSchema,
      UserVerificationSchema,
      tokenManager,
    );

    const controller = new AuthController(service);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: "cookie",
      cookieName: "token",
    });

    const userActiveMiddleware = new UserActiveMiddleware();

    const router = new AuthRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
    );

    router.register();
  }
}
