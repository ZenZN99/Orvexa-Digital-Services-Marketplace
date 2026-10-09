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
import { getQueueToken } from '@nestjs/bullmq';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { PaymentService } from '../payment.service.js';
import { Payment } from '../schema/payment.schema.js';
import { Order } from '../../orders/schema/order.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { Service } from '../../services/schema/service.schema.js';
import { Contract } from '../../contracts/schema/contract.schema.js';
import { NotificationService } from '../../notifications/notification.service.js';
import { messages } from '../../../common/libs/messages.js';
import { PaymentStatus } from '../../../common/enums/payment.enum.js';
import { OrderStatus } from '../../../common/enums/order.enum.js';
import { ContractStatus } from '../../../common/enums/contract.enum.js';
import { NotificationType } from '../../../common/enums/notification.enum.js';

vi.mock('../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('PaymentService', () => {
  let service: PaymentService;

  const paymentModel = {
    create: vi.fn(),
    findOne: vi.fn(),
    findAndCountAll: vi.fn(),
    findAll: vi.fn(),
  };
  const orderModel = { findOne: vi.fn() };
  const userModel = { findByPk: vi.fn() };
  const serviceModel = { findAll: vi.fn() };
  const contractModel = { create: vi.fn() };
  const contractQueue = { add: vi.fn() };
  const notificationService = { create: vi.fn() };
  const sequelize = { transaction: vi.fn() };

  let transaction: {
    commit: Mock;
    rollback: Mock;
    LOCK: { UPDATE: string };
  };

  const userId = 'user-1';
  const orderId = 'order-1';
  const DAY = 24 * 60 * 60 * 1000;

  const makeOrder = (overrides: Record<string, unknown> = {}) => ({
    id: orderId,
    totalAmount: 100,
    status: OrderStatus.PENDING_PAYMENT,
    services: [
      { id: 's1', price: 60, deliveryDays: 3 },
      { id: 's2', price: 40, deliveryDays: 5 },
    ],
    save: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });

  const makeUser = (overrides: Record<string, unknown> = {}) => ({
    id: userId,
    balance: 500,
    frozenBalance: 10,
    save: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });

  const makeServices = () => [
    {
      id: 's1',
      title: 'Service One',
      freelancerId: 'f1',
      freelancer: { userId: 'fu1' },
    },
    {
      id: 's2',
      title: 'Service Two',
      freelancerId: 'f2',
      freelancer: { userId: 'fu2' },
    },
  ];

  /** Prepares every mock so that pay() succeeds. Returns the main entities. */
  const setupHappyPath = () => {
    const order = makeOrder();
    const user = makeUser();
    const payment = { id: 'payment-1' };

    orderModel.findOne.mockResolvedValue(order);
    userModel.findByPk.mockResolvedValue(user);
    paymentModel.findOne.mockResolvedValue(null);
    paymentModel.create.mockResolvedValue(payment);
    serviceModel.findAll.mockResolvedValue(makeServices());
    contractModel.create.mockImplementation(async (data: any) => ({
      id: `contract-${data.serviceId}`,
      serviceId: data.serviceId,
      deadline: data.deadline,
    }));

    return { order, user, payment };
  };

  beforeEach(async () => {
    transaction = {
      commit: vi.fn().mockResolvedValue(undefined),
      rollback: vi.fn().mockResolvedValue(undefined),
      LOCK: { UPDATE: 'UPDATE' },
    };
    sequelize.transaction.mockResolvedValue(transaction);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: getModelToken(Payment), useValue: paymentModel },
        { provide: getModelToken(Order), useValue: orderModel },
        { provide: getModelToken(User), useValue: userModel },
        { provide: getModelToken(Service), useValue: serviceModel },
        { provide: getModelToken(Contract), useValue: contractModel },
        { provide: getQueueToken('contracts'), useValue: contractQueue },
        { provide: NotificationService, useValue: notificationService },
        { provide: Sequelize, useValue: sequelize },
      ],
    }).compile();

    service = module.get(PaymentService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── pay ─────────────────────────
  describe('pay', () => {
    it('should rollback and throw NotFoundException if order not found', async () => {
      orderModel.findOne.mockResolvedValue(null);

      await expect(service.pay(userId, orderId)).rejects.toThrow(
        new NotFoundException(messages.order.notFound),
      );
      expect(orderModel.findOne).toHaveBeenCalledWith({
        where: { id: orderId, clientId: userId },
        transaction,
        lock: 'UPDATE',
      });
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw BadRequestException if order is not PENDING_PAYMENT', async () => {
      orderModel.findOne.mockResolvedValue(
        makeOrder({ status: OrderStatus.IN_PROGRESS }),
      );

      await expect(service.pay(userId, orderId)).rejects.toThrow(
        new BadRequestException(messages.payment.orderAlreadyProcessed),
      );
      expect(userModel.findByPk).not.toHaveBeenCalled();
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      orderModel.findOne.mockResolvedValue(makeOrder());
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.pay(userId, orderId)).rejects.toThrow(
        new NotFoundException(messages.user.notFound),
      );
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw BadRequestException if balance is insufficient', async () => {
      const user = makeUser({ balance: 50 });
      orderModel.findOne.mockResolvedValue(makeOrder());
      userModel.findByPk.mockResolvedValue(user);

      await expect(service.pay(userId, orderId)).rejects.toThrow(
        new BadRequestException(messages.payment.insufficientBalance),
      );
      expect(user.save).not.toHaveBeenCalled();
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw BadRequestException if the order already has a completed payment', async () => {
      const user = makeUser();
      orderModel.findOne.mockResolvedValue(makeOrder());
      userModel.findByPk.mockResolvedValue(user);
      paymentModel.findOne.mockResolvedValue({ id: 'existing' });

      await expect(service.pay(userId, orderId)).rejects.toThrow(
        new BadRequestException(messages.payment.alreadyPaid),
      );
      expect(paymentModel.findOne).toHaveBeenCalledWith({
        where: { orderId, status: PaymentStatus.COMPLETED },
        transaction,
        lock: 'UPDATE',
      });
      expect(user.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if some services are no longer available', async () => {
      setupHappyPath();
      serviceModel.findAll.mockResolvedValue([makeServices()[0]]);

      await expect(service.pay(userId, orderId)).rejects.toThrow(
        new BadRequestException(messages.payment.serviceUnavailable),
      );
      expect(contractModel.create).not.toHaveBeenCalled();
      expect(transaction.rollback).toHaveBeenCalled();
      expect(transaction.commit).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if a fetched service is not part of the order', async () => {
      setupHappyPath();
      const services = makeServices();
      services[1].id = 'unknown';
      serviceModel.findAll.mockResolvedValue(services);

      await expect(service.pay(userId, orderId)).rejects.toThrow(
        new BadRequestException(messages.payment.serviceUnavailable),
      );
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should move money, create payment + contracts, commit, notify and enqueue jobs', async () => {
      const { order, user, payment } = setupHappyPath();

      const result = await service.pay(userId, orderId);

      // money moved from balance to frozenBalance
      expect(user.balance).toBe(400);
      expect(user.frozenBalance).toBe(110);
      expect(user.save).toHaveBeenCalledWith({ transaction });

      // payment
      expect(paymentModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId,
          userId,
          amount: 100,
          status: PaymentStatus.COMPLETED,
          paidAt: expect.any(Date),
        }),
        { transaction },
      );

      // contracts (snapshot of price + delivery days)
      expect(contractModel.create).toHaveBeenCalledTimes(2);
      expect(contractModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId,
          serviceId: 's1',
          freelancerId: 'f1',
          clientId: userId,
          amount: 60,
          deliveryDays: 3,
          status: ContractStatus.IN_PROGRESS,
          deadline: expect.any(Date),
        }),
        { transaction },
      );
      expect(contractModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          serviceId: 's2',
          freelancerId: 'f2',
          amount: 40,
          deliveryDays: 5,
        }),
        { transaction },
      );

      // order updated + committed
      expect(order.status).toBe(OrderStatus.IN_PROGRESS);
      expect(order.save).toHaveBeenCalledWith({ transaction });
      expect(transaction.commit).toHaveBeenCalled();
      expect(transaction.rollback).not.toHaveBeenCalled();

      // notifications (one per contract, to the freelancer's user)
      expect(notificationService.create).toHaveBeenCalledTimes(2);
      expect(notificationService.create).toHaveBeenCalledWith({
        senderId: userId,
        receiverId: 'fu1',
        targetId: 'contract-s1',
        type: NotificationType.PAYMENT,
        message: 'A client has purchased your service "Service One".',
        link: '/contract/contract-s1',
      });

      // queue jobs
      expect(contractQueue.add).toHaveBeenCalledTimes(2);
      expect(contractQueue.add).toHaveBeenCalledWith(
        'expire-contract',
        { contractId: 'contract-s1' },
        expect.objectContaining({ jobId: 'expire-contract-contract-s1' }),
      );
      const [, , opts] = contractQueue.add.mock.calls[0];
      expect(opts.delay).toBeGreaterThan(3 * DAY - 10_000);
      expect(opts.delay).toBeLessThanOrEqual(3 * DAY);

      expect(result).toEqual({
        data: payment,
        message: messages.payment.success,
      });
    });

    it('should commit before notifications and queue jobs', async () => {
      setupHappyPath();
      const order: string[] = [];
      transaction.commit.mockImplementation(async () => {
        order.push('commit');
      });
      notificationService.create.mockImplementation(async () => {
        order.push('notify');
      });
      contractQueue.add.mockImplementation(async () => {
        order.push('queue');
      });

      await service.pay(userId, orderId);

      expect(order[0]).toBe('commit');
      expect(order.indexOf('notify')).toBeLessThan(order.indexOf('queue'));
    });

    it('should NOT rollback after commit if a post-commit step fails', async () => {
      setupHappyPath();
      notificationService.create.mockRejectedValue(new Error('notify failed'));

      await expect(service.pay(userId, orderId)).rejects.toThrow(
        'notify failed',
      );
      expect(transaction.commit).toHaveBeenCalled();
      expect(transaction.rollback).not.toHaveBeenCalled();
    });

    it('should rollback if a step before commit fails', async () => {
      setupHappyPath();
      contractModel.create.mockRejectedValue(new Error('db error'));

      await expect(service.pay(userId, orderId)).rejects.toThrow('db error');
      expect(transaction.rollback).toHaveBeenCalled();
      expect(transaction.commit).not.toHaveBeenCalled();
      expect(contractQueue.add).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('should paginate and return pagination info', async () => {
      const rows = [{ id: 'p1' }];
      paymentModel.findAndCountAll.mockResolvedValue({ rows, count: 11 });

      const result = await service.findAll(2, 10);

      expect(paymentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 10,
          distinct: true,
          order: [['createdAt', 'DESC']],
        }),
      );
      expect(result).toEqual({
        data: {
          payments: rows,
          pagination: {
            total: 11,
            page: 2,
            limit: 10,
            totalPages: 2,
            hasNextPage: false,
            hasPreviousPage: true,
          },
        },
        message: null,
      });
    });

    it('should use default page=1 and limit=10', async () => {
      paymentModel.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await service.findAll();

      expect(paymentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10, offset: 0 }),
      );
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it("should return the user's payments newest first", async () => {
      const payments = [{ id: 'p1' }];
      paymentModel.findAll.mockResolvedValue(payments);

      const result = await service.findMe(userId);

      expect(paymentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
          order: [['createdAt', 'DESC']],
        }),
      );
      expect(result).toEqual({ data: payments, message: null });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('should throw NotFoundException if payment not found', async () => {
      paymentModel.findOne.mockResolvedValue(null);

      await expect(service.findOne(userId, 'payment-1')).rejects.toThrow(
        new NotFoundException(messages.payment.notFound),
      );
    });

    it('should return the payment that belongs to the user', async () => {
      const payment = { id: 'payment-1' };
      paymentModel.findOne.mockResolvedValue(payment);

      const result = await service.findOne(userId, 'payment-1');

      expect(paymentModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'payment-1', userId } }),
      );
      expect(result).toEqual({ data: payment, message: null });
    });
  });

  // ───────────────────────── rechargeBalance ─────────────────────────
  describe('rechargeBalance', () => {
    it.each([0, -50])(
      'should throw BadRequestException for invalid amount (%p)',
      async (amount) => {
        await expect(service.rechargeBalance(userId, amount)).rejects.toThrow(
          new BadRequestException(
            messages.payment.rechargeBalance.invalidAmount,
          ),
        );
        expect(userModel.findByPk).not.toHaveBeenCalled();
      },
    );

    it('should throw NotFoundException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.rechargeBalance(userId, 100)).rejects.toThrow(
        new NotFoundException(messages.user.notFound),
      );
    });

    it('should add the amount to the user balance and save', async () => {
      const user = makeUser({ balance: '200' });
      userModel.findByPk.mockResolvedValue(user);

      const result = await service.rechargeBalance(userId, 100);

      expect(user.balance).toBe(300);
      expect(user.save).toHaveBeenCalled();
      expect(result).toEqual({
        data: { amount: 100, balance: 300 },
        message: messages.payment.rechargeBalance.success,
      });
    });
  });
});
