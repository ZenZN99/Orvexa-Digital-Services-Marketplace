import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { PlatformWalletsController } from "./platform-wallets.controller";
import { PlatformWalletsRouter } from "./platform-wallets.route";
import { PlatformWalletSchema } from "./schemas/platform-wallet.schema";
import { UserSchema } from "../users/schemas/user.schema";
import { sequelize } from "../../config/db/sequelize";
import { verifyUser } from "../../config/token/verify-user";
import { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import { UserVerificationMiddleware } from "../../config/middlewares/user-verification.middleware";
import { UserVerificationSchema } from "../user-verifications/schemas/user-verification.schema";

export class PlatformWalletsModule {
  register(bob: RiserBob): void {
    const controller = new PlatformWalletsController(
      PlatformWalletSchema,
      UserSchema,
      sequelize,
    );

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: "cookie",
      cookieName: "token",
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const userVerificationMiddleware = new UserVerificationMiddleware(
      UserVerificationSchema,
    );
    const rolesMiddleware = new RolesMiddleware();

    const router = new PlatformWalletsRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
      userVerificationMiddleware,
      rolesMiddleware,
    );

    router.register();
  }
}
