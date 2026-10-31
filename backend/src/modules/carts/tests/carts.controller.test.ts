import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test";
import type { SpongHandler } from "riser-bob";
import { ServiceStatus } from "../../services/schemas/enums/service.enum";
import { ServiceSchema } from "../../services/schemas/service.schema";
import { CartsController } from "../carts.controller";
import type { CartItemSchema } from "../schemas/cart-item.schema";
import type { CartSchema } from "../schemas/cart.schema";

// ───────────────────────── types ─────────────────────────

type SpongReq = Parameters<SpongHandler>[0];
type SpongRes = Parameters<SpongHandler>[1];

interface FakeCart {
  id: number;
  userId: number;
  items?: unknown[];
}

interface FakeCartItem {
  id: number;
  cartId: number;
  serviceId: string;
  destroy: Mock<() => Promise<void>>;
}

interface FakeCartSchema {
  findOne: Mock<(options: unknown) => Promise<FakeCart | null>>;
  create: Mock<(data: unknown) => Promise<FakeCart>>;
}

interface FakeCartItemSchema {
  findOne: Mock<(options: unknown) => Promise<FakeCartItem | null>>;
  create: Mock<(data: unknown) => Promise<FakeCartItem>>;
  destroy: Mock<(options: unknown) => Promise<number>>;
}

interface FakeServiceSchema {
  findOne: Mock<(options: unknown) => Promise<object | null>>;
}

interface Tagged {
  type: string;
  payload: unknown;
}

interface FakeSpongRes {
  SpongOK: Mock<(payload: unknown) => Tagged>;
  SpongCreated: Mock<(payload: unknown) => Tagged>;
  SpongBadRequest: Mock<(payload: unknown) => Tagged>;
  SpongNotFound: Mock<(payload: unknown) => Tagged>;
}

// ───────────────────────── helpers ─────────────────────────

const userId = 7;
const serviceId = "service-1";

// Include used by the first lookup in `findMe`.
const itemsInclude = [
  {
    association: "items",
    include: [{ model: ServiceSchema, as: "service" }],
  },
];

// Include used by the re-fetch after the cart is created in `findMe`.
// (The controller passes the model class directly here, not `{ model, as }`.)
const refetchInclude = [
  {
    association: "items",
    include: [ServiceSchema],
  },
];

const makeReq = (params: { serviceId?: string } = {}): SpongReq =>
  ({ user: { id: userId }, params }) as unknown as SpongReq;

const makeCart = (overrides: Partial<FakeCart> = {}): FakeCart => ({
  id: 100,
  userId,
  ...overrides,
});

const makeCartItem = (overrides: Partial<FakeCartItem> = {}): FakeCartItem => ({
  id: 500,
  cartId: 100,
  serviceId,
  destroy: mock(async (): Promise<void> => {}),
  ...overrides,
});

const tagged = (type: string) =>
  mock((payload: unknown): Tagged => ({ type, payload }));

// The handlers are typed as returning `void | Response`, but in these tests they
// return the tagged objects produced by the fake SpongRes. This helper lets
// `toEqual` compare against those objects without fighting the handler's type.
const asTagged = (result: unknown): Tagged => result as Tagged;

// ───────────────────────── tests ─────────────────────────

describe("CartsController", () => {
  let cartSchema: FakeCartSchema;
  let cartItemSchema: FakeCartItemSchema;
  let serviceSchema: FakeServiceSchema;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: CartsController;

  beforeEach(() => {
    cartSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeCart | null> => null,
      ),
      create: mock(async (_data: unknown): Promise<FakeCart> => makeCart()),
    };
    cartItemSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeCartItem | null> => null,
      ),
      create: mock(
        async (_data: unknown): Promise<FakeCartItem> => makeCartItem(),
      ),
      destroy: mock(async (_options: unknown): Promise<number> => 0),
    };
    serviceSchema = {
      findOne: mock(async (_options: unknown): Promise<object | null> => null),
    };

    spongRes = {
      SpongOK: tagged("ok"),
      SpongCreated: tagged("created"),
      SpongBadRequest: tagged("bad-request"),
      SpongNotFound: tagged("not-found"),
    };
    res = spongRes as unknown as SpongRes;

    controller = new CartsController(
      cartSchema as unknown as typeof CartSchema,
      cartItemSchema as unknown as typeof CartItemSchema,
      serviceSchema as unknown as typeof ServiceSchema,
    );
  });

  // ───────────────────────── findMe ─────────────────────────
  describe("findMe", () => {
    it("returns the existing cart with its items and services", async () => {
      const cart = makeCart({ items: [] });
      cartSchema.findOne.mockResolvedValue(cart);

      const result = await controller.findMe(makeReq(), res);

      expect(cartSchema.findOne).toHaveBeenCalledTimes(1);
      expect(cartSchema.findOne).toHaveBeenCalledWith({
        where: { userId },
        include: itemsInclude,
      });
      expect(cartSchema.create).not.toHaveBeenCalled();
      expect(spongRes.SpongOK).toHaveBeenCalledWith({
        success: true,
        data: cart,
      });
      expect(asTagged(result)).toEqual({
        type: "ok",
        payload: { success: true, data: cart },
      });
    });

    it("creates a cart when none exists and returns it re-fetched with its relations", async () => {
      const created = makeCart();
      const loaded = makeCart({ items: [] });
      cartSchema.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(loaded);
      cartSchema.create.mockResolvedValue(created);

      await controller.findMe(makeReq(), res);

      expect(cartSchema.create).toHaveBeenCalledWith({ userId });
      expect(cartSchema.findOne).toHaveBeenCalledTimes(2);
      expect(cartSchema.findOne).toHaveBeenNthCalledWith(2, {
        where: { id: created.id },
        include: refetchInclude,
      });
      expect(spongRes.SpongOK).toHaveBeenCalledWith({
        success: true,
        data: loaded,
      });
    });
  });

  // ───────────────────────── addItem ─────────────────────────
  describe("addItem", () => {
    it("returns 404 when the service doesn't exist or isn't published", async () => {
      serviceSchema.findOne.mockResolvedValue(null);

      const result = await controller.addItem(makeReq({ serviceId }), res);

      expect(serviceSchema.findOne).toHaveBeenCalledWith({
        where: { id: serviceId, status: ServiceStatus.PUBLISHED },
      });
      expect(spongRes.SpongNotFound).toHaveBeenCalledWith({
        success: false,
        message: "Service not found.",
      });
      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: { success: false, message: "Service not found." },
      });
      expect(cartSchema.findOne).not.toHaveBeenCalled();
      expect(cartItemSchema.create).not.toHaveBeenCalled();
    });

    it("creates a cart first when the user has none, then adds the item", async () => {
      const cart = makeCart();
      const cartItem = makeCartItem({ cartId: cart.id });
      serviceSchema.findOne.mockResolvedValue({ id: serviceId });
      cartSchema.findOne.mockResolvedValue(null);
      cartSchema.create.mockResolvedValue(cart);
      cartItemSchema.findOne.mockResolvedValue(null);
      cartItemSchema.create.mockResolvedValue(cartItem);

      const result = await controller.addItem(makeReq({ serviceId }), res);

      expect(cartSchema.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(cartSchema.create).toHaveBeenCalledWith({ userId });
      expect(cartItemSchema.findOne).toHaveBeenCalledWith({
        where: { cartId: cart.id, serviceId },
      });
      expect(cartItemSchema.create).toHaveBeenCalledWith({
        cartId: cart.id,
        serviceId,
      });
      expect(spongRes.SpongCreated).toHaveBeenCalledWith({
        success: true,
        message: "Service added to cart successfully.",
        data: cartItem,
      });
      expect(asTagged(result)).toEqual({
        type: "created",
        payload: {
          success: true,
          message: "Service added to cart successfully.",
          data: cartItem,
        },
      });
    });

    it("reuses the existing cart without creating a new one", async () => {
      const cart = makeCart();
      serviceSchema.findOne.mockResolvedValue({ id: serviceId });
      cartSchema.findOne.mockResolvedValue(cart);
      cartItemSchema.findOne.mockResolvedValue(null);
      cartItemSchema.create.mockResolvedValue(
        makeCartItem({ cartId: cart.id }),
      );

      await controller.addItem(makeReq({ serviceId }), res);

      expect(cartSchema.create).not.toHaveBeenCalled();
      expect(cartItemSchema.create).toHaveBeenCalledWith({
        cartId: cart.id,
        serviceId,
      });
    });

    it("returns 400 when the service is already in the cart", async () => {
      const cart = makeCart();
      serviceSchema.findOne.mockResolvedValue({ id: serviceId });
      cartSchema.findOne.mockResolvedValue(cart);
      cartItemSchema.findOne.mockResolvedValue(
        makeCartItem({ cartId: cart.id }),
      );

      const result = await controller.addItem(makeReq({ serviceId }), res);

      expect(spongRes.SpongBadRequest).toHaveBeenCalledWith({
        success: false,
        message: "This service is already in your cart.",
      });
      expect(asTagged(result)).toEqual({
        type: "bad-request",
        payload: {
          success: false,
          message: "This service is already in your cart.",
        },
      });
      expect(cartItemSchema.create).not.toHaveBeenCalled();
      expect(spongRes.SpongCreated).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────── removeItem ─────────────────────────
  describe("removeItem", () => {
    it("returns 404 when the user has no cart", async () => {
      cartSchema.findOne.mockResolvedValue(null);

      const result = await controller.removeItem(makeReq({ serviceId }), res);

      expect(cartSchema.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: { success: false, message: "Cart not found." },
      });
      expect(cartItemSchema.findOne).not.toHaveBeenCalled();
    });

    it("returns 404 when the item isn't in the cart", async () => {
      const cart = makeCart();
      cartSchema.findOne.mockResolvedValue(cart);
      cartItemSchema.findOne.mockResolvedValue(null);

      const result = await controller.removeItem(makeReq({ serviceId }), res);

      expect(cartItemSchema.findOne).toHaveBeenCalledWith({
        where: { cartId: cart.id, serviceId },
      });
      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: { success: false, message: "Cart item not found." },
      });
    });

    it("destroys the item and returns 200", async () => {
      const cart = makeCart();
      const cartItem = makeCartItem({ cartId: cart.id });
      cartSchema.findOne.mockResolvedValue(cart);
      cartItemSchema.findOne.mockResolvedValue(cartItem);

      const result = await controller.removeItem(makeReq({ serviceId }), res);

      expect(cartItem.destroy).toHaveBeenCalledTimes(1);
      expect(spongRes.SpongOK).toHaveBeenCalledWith({
        success: true,
        message: "Service removed from cart successfully.",
      });
      expect(asTagged(result)).toEqual({
        type: "ok",
        payload: {
          success: true,
          message: "Service removed from cart successfully.",
        },
      });
    });
  });

  // ───────────────────────── clearCart ─────────────────────────
  describe("clearCart", () => {
    it("returns 404 when the user has no cart", async () => {
      cartSchema.findOne.mockResolvedValue(null);

      const result = await controller.clearCart(makeReq(), res);

      expect(cartSchema.findOne).toHaveBeenCalledWith({ where: { userId } });
      expect(asTagged(result)).toEqual({
        type: "not-found",
        payload: { success: false, message: "Cart not found." },
      });
      expect(cartItemSchema.destroy).not.toHaveBeenCalled();
    });

    it("destroys every item of the cart and returns 200", async () => {
      const cart = makeCart();
      cartSchema.findOne.mockResolvedValue(cart);
      cartItemSchema.destroy.mockResolvedValue(3);

      const result = await controller.clearCart(makeReq(), res);

      expect(cartItemSchema.destroy).toHaveBeenCalledWith({
        where: { cartId: cart.id },
      });
      expect(spongRes.SpongOK).toHaveBeenCalledWith({
        success: true,
        message: "Cart cleared successfully.",
      });
      expect(asTagged(result)).toEqual({
        type: "ok",
        payload: { success: true, message: "Cart cleared successfully." },
      });
    });
  });
});
