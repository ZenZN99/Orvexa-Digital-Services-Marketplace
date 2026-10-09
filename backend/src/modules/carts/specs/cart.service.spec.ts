import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CartService } from '../cart.service.js';
import { Cart } from '../schema/cart.schema.js';
import { CartItem } from '../schema/cart-item.schema.js';
import { Service } from '../../services/schema/service.schema.js';
import { ServiceStatus } from '../../../common/enums/service.enum.js';
import { messages } from '../../../common/libs/messages.js';

vi.mock('../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('CartService', () => {
  let service: CartService;

  const cartModel = { findOne: vi.fn(), create: vi.fn() };
  const cartItemModel = {
    findOne: vi.fn(),
    create: vi.fn(),
    destroy: vi.fn(),
  };
  const serviceModel = { findOne: vi.fn() };

  const userId = 'user-1';
  const serviceId = 'service-1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getModelToken(Cart), useValue: cartModel },
        { provide: getModelToken(CartItem), useValue: cartItemModel },
        { provide: getModelToken(Service), useValue: serviceModel },
      ],
    }).compile();

    service = module.get(CartService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it('should return the existing cart with items', async () => {
      const cart = { id: 'cart-1', userId, items: [] };
      cartModel.findOne.mockResolvedValue(cart);

      const result = await service.findMe(userId);

      expect(cartModel.findOne).toHaveBeenCalledTimes(1);
      expect(cartModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId } }),
      );
      expect(cartModel.create).not.toHaveBeenCalled();
      expect(result).toEqual({ data: cart, message: null });
    });

    it('should create a cart when none exists, then re-fetch it with items', async () => {
      const created = { id: 'cart-1', userId };
      const fetched = { id: 'cart-1', userId, items: [] };
      cartModel.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(fetched);
      cartModel.create.mockResolvedValue(created);

      const result = await service.findMe(userId);

      expect(cartModel.create).toHaveBeenCalledWith({ userId });
      expect(cartModel.findOne).toHaveBeenCalledTimes(2);
      expect(cartModel.findOne).toHaveBeenLastCalledWith(
        expect.objectContaining({ where: { id: 'cart-1' } }),
      );
      expect(result).toEqual({ data: fetched, message: null });
    });
  });

  // ───────────────────────── addItem ─────────────────────────
  describe('addItem', () => {
    it('should throw NotFoundException if service is not found or not published', async () => {
      serviceModel.findOne.mockResolvedValue(null);

      await expect(service.addItem(userId, serviceId)).rejects.toThrow(
        new NotFoundException(messages.service.notFound),
      );
      expect(serviceModel.findOne).toHaveBeenCalledWith({
        where: { id: serviceId, status: ServiceStatus.PUBLISHED },
      });
      expect(cartModel.findOne).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when adding own service', async () => {
      serviceModel.findOne.mockResolvedValue({
        id: serviceId,
        freelancerId: userId,
      });

      await expect(service.addItem(userId, serviceId)).rejects.toThrow(
        new BadRequestException(messages.cart.addItem.cannotAddOwnService),
      );
      expect(cartItemModel.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if item already exists in cart', async () => {
      serviceModel.findOne.mockResolvedValue({
        id: serviceId,
        freelancerId: 'other',
      });
      cartModel.findOne.mockResolvedValue({ id: 'cart-1' });
      cartItemModel.findOne.mockResolvedValue({ id: 'item-1' });

      await expect(service.addItem(userId, serviceId)).rejects.toThrow(
        new BadRequestException(messages.cart.addItem.alreadyExists),
      );
      expect(cartItemModel.create).not.toHaveBeenCalled();
    });

    it('should add the item to an existing cart', async () => {
      const cartItem = { id: 'item-1', cartId: 'cart-1', serviceId };
      serviceModel.findOne.mockResolvedValue({
        id: serviceId,
        freelancerId: 'other',
      });
      cartModel.findOne.mockResolvedValue({ id: 'cart-1' });
      cartItemModel.findOne.mockResolvedValue(null);
      cartItemModel.create.mockResolvedValue(cartItem);

      const result = await service.addItem(userId, serviceId);

      expect(cartModel.create).not.toHaveBeenCalled();
      expect(cartItemModel.findOne).toHaveBeenCalledWith({
        where: { cartId: 'cart-1', serviceId },
      });
      expect(cartItemModel.create).toHaveBeenCalledWith({
        cartId: 'cart-1',
        serviceId,
      });
      expect(result).toEqual({
        data: cartItem,
        message: messages.cart.addItem.success,
      });
    });

    it('should create a cart first if the user has none, then add the item', async () => {
      const cartItem = { id: 'item-1' };
      serviceModel.findOne.mockResolvedValue({
        id: serviceId,
        freelancerId: 'other',
      });
      cartModel.findOne.mockResolvedValue(null);
      cartModel.create.mockResolvedValue({ id: 'new-cart' });
      cartItemModel.findOne.mockResolvedValue(null);
      cartItemModel.create.mockResolvedValue(cartItem);

      const result = await service.addItem(userId, serviceId);

      expect(cartModel.create).toHaveBeenCalledWith({ userId });
      expect(cartItemModel.create).toHaveBeenCalledWith({
        cartId: 'new-cart',
        serviceId,
      });
      expect(result.data).toBe(cartItem);
    });
  });

  // ───────────────────────── removeItem ─────────────────────────
  describe('removeItem', () => {
    it('should throw NotFoundException if cart not found', async () => {
      cartModel.findOne.mockResolvedValue(null);

      await expect(service.removeItem(userId, serviceId)).rejects.toThrow(
        new NotFoundException(messages.cart.notFound),
      );
      expect(cartItemModel.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if cart item not found', async () => {
      cartModel.findOne.mockResolvedValue({ id: 'cart-1' });
      cartItemModel.findOne.mockResolvedValue(null);

      await expect(service.removeItem(userId, serviceId)).rejects.toThrow(
        new NotFoundException(messages.cart.itemNotFound),
      );
    });

    it('should destroy the cart item and return success', async () => {
      const cartItem = { destroy: vi.fn().mockResolvedValue(undefined) };
      cartModel.findOne.mockResolvedValue({ id: 'cart-1' });
      cartItemModel.findOne.mockResolvedValue(cartItem);

      const result = await service.removeItem(userId, serviceId);

      expect(cartItemModel.findOne).toHaveBeenCalledWith({
        where: { cartId: 'cart-1', serviceId },
      });
      expect(cartItem.destroy).toHaveBeenCalled();
      expect(result).toEqual({
        data: null,
        message: messages.cart.removeItem.success,
      });
    });
  });

  // ───────────────────────── clearCart ─────────────────────────
  describe('clearCart', () => {
    it('should throw NotFoundException if cart not found', async () => {
      cartModel.findOne.mockResolvedValue(null);

      await expect(service.clearCart(userId)).rejects.toThrow(
        new NotFoundException(messages.cart.notFound),
      );
      expect(cartItemModel.destroy).not.toHaveBeenCalled();
    });

    it('should destroy all items of the cart and return success', async () => {
      cartModel.findOne.mockResolvedValue({ id: 'cart-1' });
      cartItemModel.destroy.mockResolvedValue(3);

      const result = await service.clearCart(userId);

      expect(cartItemModel.destroy).toHaveBeenCalledWith({
        where: { cartId: 'cart-1' },
      });
      expect(result).toEqual({
        data: null,
        message: messages.cart.clear.success,
      });
    });
  });
});
