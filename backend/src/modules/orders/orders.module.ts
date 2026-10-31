import type { RiserBob } from "riser-bob";
import { AuthMiddleware } from "riser-bob";
import { OrdersController } from "./orders.controller";
import { OrdersRouter } from "./orders.route";
import { verifyUser } from "../../config/token/verify-user";
import { OrderSchema } from "./schemas/order.schema";
import { CartSchema } from "../carts/schemas/cart.schema";
import { CartItemSchema } from "../carts/schemas/cart-item.schema";
import { UserActiveMiddleware } from "../../config/middlewares/user-active.middleware";
import { RolesMiddleware } from "../../config/middlewares/roles.middleware";
import { sequelize } from "../../config/db/sequelize";
import { OrdersService } from "./orders.service";

export class OrdersModule {
  register(bob: RiserBob): void {
    const service = new OrdersService(
      OrderSchema,
      CartSchema,
      CartItemSchema,
      sequelize,
    );

    const controller = new OrdersController(service);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: "cookie",
      cookieName: "token",
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const rolesMiddleware = new RolesMiddleware();

    const router = new OrdersRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
      rolesMiddleware,
    );

    router.register();
  }
}
