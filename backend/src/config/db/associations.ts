import { CartItemSchema } from "../../modules/carts/schemas/cart-item.schema";
import { CartSchema } from "../../modules/carts/schemas/cart.schema";
import { ServiceSchema } from "../../modules/services/schemas/service.schema";

export function setupAssociations() {
  CartItemSchema.belongsTo(CartSchema, {
    foreignKey: "cartId",
    as: "cart",
  });

  CartItemSchema.belongsTo(ServiceSchema, {
    foreignKey: "serviceId",
    as: "service",
  });
}
