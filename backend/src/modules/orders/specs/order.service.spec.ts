import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { OrderService } from '../order.service.js';
import { Order } from '../schema/order.schema.js';
import { Cart } from '../../carts/schema/cart.schema.js';
import { CartItem } from '../../carts/schema/cart-item.schema.js';
import { messages } from '../../../common/libs/messages.js';
import { OrderStatus } from '../../../common/enums/order.enum.js';

vi.mock('../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('OrderService', () => {
  let service: OrderService;

  const orderModel = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    findAndCountAll: vi.fn(),
  };
  const cartModel = { findOne: vi.fn() };
  const cartItemModel = { findAll: vi.fn(), destroy: vi.fn() };
  const sequelize = { transaction: vi.fn() };

  let transaction: {
    commit: Mock;
    rollback: Mock;
    LOCK: { UPDATE: string };
  };

  const userId = 'user-1';

  const makeCartItem = (
    serviceId: string,
    price: number | string,
    overrides: Record<string, unknown> = {},
  ) => ({
    serviceId,
    service: {
      title: `Title ${serviceId}`,
      description: `Desc ${serviceId}`,
      price,
      deliveryDays: 3,
      images: [{ url: 'img', publicId: 'pid' }],
      freelancerId: `freelancer-${serviceId}`,
      freelancer: {
        user: {
          id: `fu-${serviceId}`,
          firstName: 'Free',
          lastName: 'Lancer',
          profile: { avatar: { url: 'avatar-url', publicId: '' } },
        },
      },
      ...overrides,
    },
  });

  beforeEach(async () => {
    transaction = {
      commit: vi.fn().mockResolvedValue(undefined),
      rollback: vi.fn().mockResolvedValue(undefined),
      LOCK: { UPDATE: 'UPDATE' },
    };
    sequelize.transaction.mockResolvedValue(transaction);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getModelToken(Order), useValue: orderModel },
        { provide: getModelToken(Cart), useValue: cartModel },
        { provide: getModelToken(CartItem), useValue: cartItemModel },
        { provide: Sequelize, useValue: sequelize },
      ],
    }).compile();

    service = module.get(OrderService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    it('should rollback and throw NotFoundException if cart not found', async () => {
      cartModel.findOne.mockResolvedValue(null);

      await expect(service.create(userId)).rejects.toThrow(
        new NotFoundException(messages.cart.notFound),
      );
      expect(cartModel.findOne).toHaveBeenCalledWith({
        where: { userId },
        transaction,
        lock: 'UPDATE',
      });
      expect(transaction.rollback).toHaveBeenCalled();
      expect(transaction.commit).not.toHaveBeenCalled();
    });

    it('should rollback and throw BadRequestException if cart is empty', async () => {
      cartModel.findOne.mockResolvedValue({ id: 'cart-1' });
      cartItemModel.findAll.mockResolvedValue([]);

      await expect(service.create(userId)).rejects.toThrow(
        new BadRequestException(messages.order.emptyCart),
      );
      expect(orderModel.create).not.toHaveBeenCalled();
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should create the order from cart items, clear the cart and commit', async () => {
      const order = { id: 'order-1' };
      cartModel.findOne.mockResolvedValue({ id: 'cart-1' });
      cartItemModel.findAll.mockResolvedValue([
        makeCartItem('s1', '100'),
        makeCartItem('s2', 50.5),
      ]);
      orderModel.create.mockResolvedValue(order);

      const result = await service.create(userId);

      expect(cartItemModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { cartId: 'cart-1' }, transaction }),
      );
      expect(orderModel.create).toHaveBeenCalledWith(
        {
          clientId: userId,
          services: [
            {
              id: 's1',
              title: 'Title s1',
              description: 'Desc s1',
              price: 100,
              deliveryDays: 3,
              images: [{ url: 'img', publicId: 'pid' }],
              freelancer: {
                id: 'freelancer-s1',
                user: {
                  id: 'fu-s1',
                  firstName: 'Free',
                  lastName: 'Lancer',
                  profile: { avatar: { url: 'avatar-url', publicId: '' } },
                },
              },
            },
            expect.objectContaining({ id: 's2', price: 50.5 }),
          ],
          totalAmount: 150.5,
          status: OrderStatus.PENDING_PAYMENT,
        },
        { transaction },
      );
      expect(cartItemModel.destroy).toHaveBeenCalledWith({
        where: { cartId: 'cart-1' },
        transaction,
      });
      expect(transaction.commit).toHaveBeenCalled();
      expect(transaction.rollback).not.toHaveBeenCalled();
      expect(result).toEqual({
        data: order,
        message: messages.order.create.success,
      });
    });

    it('should set avatar to null when freelancer user has no profile', async () => {
      const item = makeCartItem('s1', 10);
      (item.service.freelancer.user as any).profile = null;
      cartModel.findOne.mockResolvedValue({ id: 'cart-1' });
      cartItemModel.findAll.mockResolvedValue([item]);
      orderModel.create.mockResolvedValue({ id: 'order-1' });

      await service.create(userId);

      const [payload] = orderModel.create.mock.calls[0];
      expect(payload.services[0].freelancer.user.profile).toEqual({
        avatar: null,
      });
    });

    it('should rollback if order creation fails', async () => {
      cartModel.findOne.mockResolvedValue({ id: 'cart-1' });
      cartItemModel.findAll.mockResolvedValue([makeCartItem('s1', 10)]);
      orderModel.create.mockRejectedValue(new Error('db error'));

      await expect(service.create(userId)).rejects.toThrow('db error');
      expect(cartItemModel.destroy).not.toHaveBeenCalled();
      expect(transaction.rollback).toHaveBeenCalled();
      expect(transaction.commit).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('should paginate and return pagination info', async () => {
      const rows = [{ id: 'o1' }];
      orderModel.findAndCountAll.mockResolvedValue({ rows, count: 25 });

      const result = await service.findAll(2, 10);

      expect(orderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 10,
          distinct: true,
          order: [['createdAt', 'DESC']],
        }),
      );
      expect(result).toEqual({
        data: {
          orders: rows,
          pagination: {
            total: 25,
            page: 2,
            limit: 10,
            totalPages: 3,
            hasNextPage: true,
            hasPreviousPage: true,
          },
        },
        message: null,
      });
    });

    it('should use default page=1 and limit=10', async () => {
      orderModel.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await service.findAll();

      expect(orderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10, offset: 0 }),
      );
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it("should return the user's orders newest first", async () => {
      const orders = [{ id: 'o1' }, { id: 'o2' }];
      orderModel.findAll.mockResolvedValue(orders);

      const result = await service.findMe(userId);

      expect(orderModel.findAll).toHaveBeenCalledWith({
        where: { clientId: userId },
        order: [['createdAt', 'DESC']],
      });
      expect(result).toEqual({ data: orders, message: null });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('should throw NotFoundException if order not found', async () => {
      orderModel.findOne.mockResolvedValue(null);

      await expect(service.findOne(userId, 'order-1')).rejects.toThrow(
        new NotFoundException(messages.order.notFound),
      );
    });

    it('should return the order that belongs to the user', async () => {
      const order = { id: 'order-1' };
      orderModel.findOne.mockResolvedValue(order);

      const result = await service.findOne(userId, 'order-1');

      expect(orderModel.findOne).toHaveBeenCalledWith({
        where: { id: 'order-1', clientId: userId },
      });
      expect(result).toEqual({ data: order, message: null });
    });
  });

  // ───────────────────────── destroy ─────────────────────────
  describe('destroy', () => {
    it('should throw NotFoundException if order not found', async () => {
      orderModel.findOne.mockResolvedValue(null);

      await expect(service.destroy(userId, 'order-1')).rejects.toThrow(
        new NotFoundException(messages.order.notFound),
      );
    });

    it('should throw BadRequestException if order is not PENDING_PAYMENT', async () => {
      const order = {
        status: OrderStatus.IN_PROGRESS,
        destroy: vi.fn(),
      };
      orderModel.findOne.mockResolvedValue(order);

      await expect(service.destroy(userId, 'order-1')).rejects.toThrow(
        new BadRequestException(messages.order.cannotDelete),
      );
      expect(order.destroy).not.toHaveBeenCalled();
    });

    it('should destroy a pending order and return success', async () => {
      const order = {
        status: OrderStatus.PENDING_PAYMENT,
        destroy: vi.fn().mockResolvedValue(undefined),
      };
      orderModel.findOne.mockResolvedValue(order);

      const result = await service.destroy(userId, 'order-1');

      expect(order.destroy).toHaveBeenCalled();
      expect(result).toEqual({
        data: null,
        message: messages.order.destroy.success,
      });
    });
  });
});
