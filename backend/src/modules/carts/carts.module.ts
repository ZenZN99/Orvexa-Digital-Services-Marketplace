import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { CartsController } from "./carts.controller";
import { CartsRouter } from "./carts.route";
import { verifyUser } from "../../config/token/verify-user";
import { CartSchema } from "./schemas/cart.schema";
import { CartItemSchema } from "./schemas/cart-item.schema";
import { ServiceSchema } from "../services/schemas/service.schema";
import { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import { RolesMiddleware } from "../../config/middlewares/roles.middleware";

export class CartsModule {
  register(bob: RiserBob): void {
    const controller = new CartsController(
      CartSchema,
      CartItemSchema,
      ServiceSchema,
    );

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: "cookie",
      cookieName: "token",
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const rolesMiddleware = new RolesMiddleware();

    const router = new CartsRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
      rolesMiddleware,
    );

    router.register();
  }
}
