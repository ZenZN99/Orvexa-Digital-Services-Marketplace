import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { FreelancersController } from "./freelancers.controller";
import { FreelancersRouter } from "./freelancers.route";
import { FreelancerSchema } from "./schemas/freelancer.schema";
import { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import { verifyUser } from "../../config/token/verify-user";

export class FreelancersModule {
  register(bob: RiserBob): void {
    const controller = new FreelancersController(FreelancerSchema);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: "cookie",
      cookieName: "token",
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const rolesMiddleware = new RolesMiddleware();

    const router = new FreelancersRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
      rolesMiddleware,
    );

    router.register();
  }
}
