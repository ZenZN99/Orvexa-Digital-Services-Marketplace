import type { SpongHandler } from "riser-bob";
import type { CartSchema } from "./schemas/cart.schema";
import { ServiceSchema } from "../services/schemas/service.schema";
import type { CartItemSchema } from "./schemas/cart-item.schema";
import { ServiceStatus } from "../services/schemas/enums/service.enum";

export class CartsController {
  constructor(
    private readonly cartSchema: typeof CartSchema,
    private readonly cartItemSchema: typeof CartItemSchema,
    private readonly serviceSchema: typeof ServiceSchema,
  ) {}

  readonly findMe: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user?.id;

    let cart = await this.cartSchema.findOne({
      where: { userId },
      include: [
        {
          association: "items",
          include: [
            {
              model: ServiceSchema,
              as: "service",
            },
          ],
        },
      ],
    });

    if (!cart) {
      cart = await this.cartSchema.create({
        userId,
      });

      cart = await this.cartSchema.findOne({
        where: { id: cart.id },
        include: [
          {
            association: "items",
            include: [ServiceSchema],
          },
        ],
      });
    }

    return spongRes.SpongOK({
      success: true,
      data: cart,
    });
  };

  readonly addItem: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user?.id;
    const { serviceId } = spongReq.params;

    const service = await this.serviceSchema.findOne({
      where: {
        id: serviceId,
        status: ServiceStatus.PUBLISHED,
      },
    });

    if (!service) {
      return spongRes.SpongNotFound({
        success: false,
        message: "Service not found.",
      });
    }

    let cart = await this.cartSchema.findOne({
      where: { userId },
    });

    if (!cart) {
      cart = await this.cartSchema.create({
        userId,
      });
    }

    const existingItem = await this.cartItemSchema.findOne({
      where: {
        cartId: cart.id,
        serviceId,
      },
    });

    if (existingItem) {
      return spongRes.SpongBadRequest({
        success: false,
        message: "This service is already in your cart.",
      });
    }

    const cartItem = await this.cartItemSchema.create({
      cartId: cart.id,
      serviceId,
    });

    return spongRes.SpongCreated({
      success: true,
      message: "Service added to cart successfully.",
      data: cartItem,
    });
  };

  readonly removeItem: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user?.id;
    const { serviceId } = spongReq.params;

    const cart = await this.cartSchema.findOne({
      where: { userId },
    });

    if (!cart) {
      return spongRes.SpongNotFound({
        success: false,
        message: "Cart not found.",
      });
    }

    const cartItem = await this.cartItemSchema.findOne({
      where: {
        cartId: cart.id,
        serviceId,
      },
    });

    if (!cartItem) {
      return spongRes.SpongNotFound({
        success: false,
        message: "Cart item not found.",
      });
    }

    await cartItem.destroy();

    return spongRes.SpongOK({
      success: true,
      message: "Service removed from cart successfully.",
    });
  };

  readonly clearCart: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user?.id;

    const cart = await this.cartSchema.findOne({
      where: { userId },
    });

    if (!cart) {
      return spongRes.SpongNotFound({
        success: false,
        message: "Cart not found.",
      });
    }

    await this.cartItemSchema.destroy({
      where: {
        cartId: cart.id,
      },
    });

    return spongRes.SpongOK({
      success: true,
      message: "Cart cleared successfully.",
    });
  };
}
