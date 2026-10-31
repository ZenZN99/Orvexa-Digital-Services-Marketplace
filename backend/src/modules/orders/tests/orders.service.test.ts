import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test";
import type { Sequelize } from "sequelize";
import { buildPagination } from "../../../utilities/pagination";
import type { CartItemSchema } from "../../carts/schemas/cart-item.schema";
import type { CartSchema } from "../../carts/schemas/cart.schema";
import { ServiceStatus } from "../../services/schemas/enums/service.enum";
import { OrdersService } from "../orders.service";
import { OrderStatus } from "../schemas/enums/order.enum";
import type { OrderSchema } from "../schemas/order.schema";

// ───────────────────────── types ─────────────────────────

interface FakeTransaction {
  commit: Mock<() => Promise<void>>;
  rollback: Mock<() => Promise<void>>;
  LOCK: { UPDATE: string };
}

interface FakeSequelize {
  transaction: Mock<() => Promise<FakeTransaction>>;
}

interface FakeOrder {
  id: string;
  status: OrderStatus;
  destroy: Mock<() => Promise<void>>;
}

interface FakeCartItem {
  serviceId: string;
  service: {
    title: string;
    description: string;
    price: string | number;
    deliveryDays: number;
    images: string[];
    freelancerId: string;
    freelancer: {
      user: {
        id: string;
        firstName: string;
        lastName: string;
        profile: { avatar: string } | null;
      };
    };
  };
}

interface FakeOrderSchema {
  create: Mock<(data: unknown, options: unknown) => Promise<{ id: string }>>;
  findAndCountAll: Mock<
    (options: unknown) => Promise<{ rows: unknown[]; count: number }>
  >;
  findAll: Mock<(options: unknown) => Promise<unknown[]>>;
  findOne: Mock<(options: unknown) => Promise<FakeOrder | null>>;
}

interface FakeCartSchema {
  findOne: Mock<(options: unknown) => Promise<{ id: string } | null>>;
}

interface FakeCartItemSchema {
  findAll: Mock<(options: unknown) => Promise<FakeCartItem[]>>;
  destroy: Mock<(options: unknown) => Promise<number>>;
}

// ───────────────────────── helpers ─────────────────────────

const userId = "user-1";
const cartId = "cart-1";
const orderId = "order-1";

const makeOrder = (overrides: Partial<FakeOrder> = {}): FakeOrder => ({
  id: orderId,
  status: OrderStatus.PENDING_PAYMENT,
  destroy: mock(async (): Promise<void> => {}),
  ...overrides,
});

const makeCartItem = (
  serviceId: string,
  price: string | number,
  overrides: Partial<FakeCartItem["service"]> = {},
): FakeCartItem => ({
  serviceId,
  service: {
    title: `Service ${serviceId}`,
    description: `Description ${serviceId}`,
    price,
    deliveryDays: 3,
    images: ["image-1.png"],
    freelancerId: "freelancer-1",
    freelancer: {
      user: {
        id: "freelancer-user-1",
        firstName: "Jane",
        lastName: "Doe",
        profile: { avatar: "avatar.png" },
      },
    },
    ...overrides,
  },
});

// Compare results without fighting the service's narrow `as const` return types.
const plain = (value: unknown): unknown => value;

// ───────────────────────── tests ─────────────────────────

describe("OrdersService", () => {
  let transaction: FakeTransaction;
  let sequelize: FakeSequelize;
  let orderSchema: FakeOrderSchema;
  let cartSchema: FakeCartSchema;
  let cartItemSchema: FakeCartItemSchema;
  let service: OrdersService;

  beforeEach(() => {
    transaction = {
      commit: mock(async (): Promise<void> => {}),
      rollback: mock(async (): Promise<void> => {}),
      LOCK: { UPDATE: "UPDATE" },
    };
    sequelize = {
      transaction: mock(async (): Promise<FakeTransaction> => transaction),
    };
    orderSchema = {
      create: mock(
        async (_data: unknown, _options: unknown): Promise<{ id: string }> => ({
          id: orderId,
        }),
      ),
      findAndCountAll: mock(
        async (
          _options: unknown,
        ): Promise<{ rows: unknown[]; count: number }> => ({
          rows: [],
          count: 0,
        }),
      ),
      findAll: mock(async (_options: unknown): Promise<unknown[]> => []),
      findOne: mock(
        async (_options: unknown): Promise<FakeOrder | null> => null,
      ),
    };
    cartSchema = {
      findOne: mock(
        async (_options: unknown): Promise<{ id: string } | null> => ({
          id: cartId,
        }),
      ),
    };
    cartItemSchema = {
      findAll: mock(async (_options: unknown): Promise<FakeCartItem[]> => []),
      destroy: mock(async (_options: unknown): Promise<number> => 0),
    };

    service = new OrdersService(
      orderSchema as unknown as typeof OrderSchema,
      cartSchema as unknown as typeof CartSchema,
      cartItemSchema as unknown as typeof CartItemSchema,
      sequelize as unknown as Sequelize,
    );
  });

  // ───────────────────────── create ─────────────────────────
  describe("create", () => {
    it("returns 404 when the user has no cart", async () => {
      cartSchema.findOne.mockResolvedValue(null);

      const result = await service.create(userId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: "Cart not found",
      });
      expect(cartItemSchema.findAll).not.toHaveBeenCalled();
      expect(orderSchema.create).not.toHaveBeenCalled();
    });

    it("returns 400 when the cart has no published services", async () => {
      cartItemSchema.findAll.mockResolvedValue([]);

      const result = await service.create(userId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: "Your cart is empty.",
      });
      expect(orderSchema.create).not.toHaveBeenCalled();
      expect(cartItemSchema.destroy).not.toHaveBeenCalled();
    });

    it("locks the user's cart inside the transaction", async () => {
      await service.create(userId);

      expect(cartSchema.findOne).toHaveBeenCalledWith({
        where: { userId },
        transaction,
        lock: "UPDATE",
      });
    });

    it("only loads the cart items whose service is published", async () => {
      await service.create(userId);

      expect(cartItemSchema.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { cartId },
          transaction,
          include: expect.arrayContaining([
            expect.objectContaining({
              as: "service",
              where: { status: ServiceStatus.PUBLISHED },
            }),
          ]),
        }),
      );
    });

    it("snapshots the services, sums the total and creates a pending-payment order", async () => {
      cartItemSchema.findAll.mockResolvedValue([
        makeCartItem("service-1", "10.50"),
        makeCartItem("service-2", 20),
      ]);

      await service.create(userId);

      expect(orderSchema.create).toHaveBeenCalledWith(
        {
          clientId: userId,
          services: [
            {
              id: "service-1",
              title: "Service service-1",
              description: "Description service-1",
              price: 10.5,
              deliveryDays: 3,
              images: ["image-1.png"],
              freelancer: {
                id: "freelancer-1",
                user: {
                  id: "freelancer-user-1",
                  firstName: "Jane",
                  lastName: "Doe",
                  profile: { avatar: "avatar.png" },
                },
              },
            },
            expect.objectContaining({ id: "service-2", price: 20 }),
          ],
          totalAmount: 30.5,
          status: OrderStatus.PENDING_PAYMENT,
        },
        { transaction },
      );
    });

    it("defaults the freelancer avatar to null when they have no profile", async () => {
      cartItemSchema.findAll.mockResolvedValue([
        makeCartItem("service-1", 10, {
          freelancer: {
            user: {
              id: "freelancer-user-1",
              firstName: "Jane",
              lastName: "Doe",
              profile: null,
            },
          },
        }),
      ]);

      await service.create(userId);

      expect(orderSchema.create).toHaveBeenCalledWith(
        expect.objectContaining({
          services: [
            expect.objectContaining({
              freelancer: expect.objectContaining({
                user: expect.objectContaining({ profile: { avatar: null } }),
              }),
            }),
          ],
        }),
        expect.anything(),
      );
    });

    it("empties the cart, commits and returns the created order", async () => {
      cartItemSchema.findAll.mockResolvedValue([makeCartItem("service-1", 10)]);
      const order = { id: "created-1" };
      orderSchema.create.mockResolvedValue(order);

      const result = await service.create(userId);

      expect(cartItemSchema.destroy).toHaveBeenCalledWith({
        where: { cartId },
        transaction,
      });
      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(transaction.rollback).not.toHaveBeenCalled();
      expect(plain(result)).toEqual({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    });

    it("rolls back and rethrows when something fails", async () => {
      cartItemSchema.findAll.mockResolvedValue([makeCartItem("service-1", 10)]);
      orderSchema.create.mockRejectedValue(new Error("boom"));

      await expect(service.create(userId)).rejects.toThrow("boom");

      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(transaction.commit).not.toHaveBeenCalled();
      expect(cartItemSchema.destroy).not.toHaveBeenCalled();
    });

    it.todo(
      "rolls back (or commits) the transaction when it returns early because the cart is missing or empty (it is left open today)",
    );
  });

  // ───────────────────────── findAll ─────────────────────────
  describe("findAll", () => {
    it("uses the default page and limit when none are given", async () => {
      await service.findAll();

      expect(orderSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 0,
          order: [["createdAt", "DESC"]],
          distinct: true,
        }),
      );
    });

    it("derives the offset from the page and limit", async () => {
      await service.findAll(3, 5);

      expect(orderSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 5, offset: 10 }),
      );
    });

    it("includes the client with only its public fields", async () => {
      await service.findAll();

      expect(orderSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: [
            expect.objectContaining({
              as: "client",
              attributes: ["id", "firstName", "lastName", "email"],
            }),
          ],
        }),
      );
    });

    it("returns the orders with their pagination", async () => {
      const rows = [{ id: "o1" }, { id: "o2" }];
      orderSchema.findAndCountAll.mockResolvedValue({ rows, count: 12 });

      const result = await service.findAll(2, 5);

      expect(plain(result)).toEqual({
        success: true,
        data: rows,
        pagination: buildPagination(12, 2, 5),
      });
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe("findMe", () => {
    it("returns the client's orders, newest first", async () => {
      const orders = [{ id: "o1" }, { id: "o2" }];
      orderSchema.findAll.mockResolvedValue(orders);

      const result = await service.findMe(userId);

      expect(orderSchema.findAll).toHaveBeenCalledWith({
        where: { clientId: userId },
        order: [["createdAt", "DESC"]],
      });
      expect(plain(result)).toEqual({ success: true, data: orders });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe("findOne", () => {
    it("returns an error when the order isn't the client's", async () => {
      orderSchema.findOne.mockResolvedValue(null);

      const result = await service.findOne(userId, orderId);

      expect(orderSchema.findOne).toHaveBeenCalledWith({
        where: { id: orderId, clientId: userId },
      });
      expect(plain(result)).toEqual({
        error: true,
        message: "Order not found",
      });
    });

    it("returns the order", async () => {
      const order = makeOrder();
      orderSchema.findOne.mockResolvedValue(order);

      const result = await service.findOne(userId, orderId);

      expect(plain(result)).toEqual({ success: true, data: order });
    });
  });

  // ───────────────────────── delete ─────────────────────────
  describe("delete", () => {
    it("returns 404 when the order isn't the client's", async () => {
      orderSchema.findOne.mockResolvedValue(null);

      const result = await service.delete(userId, orderId);

      expect(orderSchema.findOne).toHaveBeenCalledWith({
        where: { id: orderId, clientId: userId },
      });
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: "Order not found",
      });
    });

    it("returns 400 and keeps the order when it isn't awaiting payment", async () => {
      const paidStatus = Object.values(OrderStatus).find(
        (status) => status !== OrderStatus.PENDING_PAYMENT,
      ) as OrderStatus;
      const order = makeOrder({ status: paidStatus });
      orderSchema.findOne.mockResolvedValue(order);

      const result = await service.delete(userId, orderId);

      expect(order.destroy).not.toHaveBeenCalled();
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: "Only orders awaiting payment can be deleted.",
      });
    });

    it("destroys an order that is awaiting payment", async () => {
      const order = makeOrder({ status: OrderStatus.PENDING_PAYMENT });
      orderSchema.findOne.mockResolvedValue(order);

      const result = await service.delete(userId, orderId);

      expect(order.destroy).toHaveBeenCalledTimes(1);
      expect(plain(result)).toEqual({
        success: true,
        message: "Order deleted successfully",
      });
    });
  });
});
