import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
  type Mock,
} from 'bun:test';
import { Validator } from 'riser-bob';
import type { Sequelize } from 'sequelize';
import { buildPagination } from '../../../utilities/pagination';
import type { ContractQueue } from '../../contracts/queues/contracts.queue';
import type { ContractSchema } from '../../contracts/schemas/contract.schema';
import { ContractStatus } from '../../contracts/schemas/enums/contract.enum';
import type { NotificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../notifications/schemas/enums/notification.enum';
import { OrderStatus } from '../../orders/schemas/enums/order.enum';
import type { OrderSchema } from '../../orders/schemas/order.schema';
import type { ServiceSchema } from '../../services/schemas/service.schema';
import type { UserSchema } from '../../users/schemas/user.schema';
import { PaymentsService } from '../payments.service';
import { RechargeBalanceRule } from '../rules/recharge-balance.rule';
import { PaymentStatus } from '../schemas/enums/payment.enum';
import type { PaymentSchema } from '../schemas/payment.schema';

// ───────────────────────── types ─────────────────────────

type ValidationResult = ReturnType<typeof Validator.validate>;

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
  totalAmount: string | number;
  services: { id: string; price: number; deliveryDays: number }[];
  save: Mock<(options?: unknown) => Promise<void>>;
}

interface FakeUser {
  balance: string | number;
  frozenBalance: string | number;
  save: Mock<(options?: unknown) => Promise<void>>;
}

interface FakeService {
  id: string;
  title: string;
  freelancerId: string;
  freelancer: { userId: string };
}

interface FakeContract {
  id: string;
  serviceId: string;
  deadline: Date;
}

interface FakePaymentSchema {
  create: Mock<(data: unknown, options: unknown) => Promise<{ id: string }>>;
  findOne: Mock<(options: unknown) => Promise<{ id: string } | null>>;
  findAndCountAll: Mock<
    (options: unknown) => Promise<{ rows: unknown[]; count: number }>
  >;
  findAll: Mock<(options: unknown) => Promise<unknown[]>>;
}

interface FakeOrderSchema {
  findOne: Mock<(options: unknown) => Promise<FakeOrder | null>>;
}

interface FakeUserSchema {
  findByPk: Mock<(id: string, options?: unknown) => Promise<FakeUser | null>>;
}

interface FakeServiceSchema {
  findAll: Mock<(options: unknown) => Promise<FakeService[]>>;
}

interface FakeContractSchema {
  create: Mock<(data: unknown, options: unknown) => Promise<FakeContract>>;
}

interface FakeNotificationsService {
  create: Mock<(data: unknown) => Promise<void>>;
}

interface FakeContractQueue {
  add: Mock<(name: string, data: unknown, options: unknown) => Promise<void>>;
}

// ───────────────────────── helpers ─────────────────────────

const userId = 'user-1';
const orderId = 'order-1';
const paymentId = 'payment-1';
const DAY_MS = 86_400_000;

const makeValidation = (valid: boolean, errors: unknown = []) =>
  ({ valid, errors }) as unknown as ValidationResult;

const makeOrder = (overrides: Partial<FakeOrder> = {}): FakeOrder => ({
  id: orderId,
  status: OrderStatus.PENDING_PAYMENT,
  totalAmount: 100,
  services: [{ id: 'service-1', price: 100, deliveryDays: 3 }],
  save: mock(async (_options?: unknown): Promise<void> => {}),
  ...overrides,
});

const makeUser = (overrides: Partial<FakeUser> = {}): FakeUser => ({
  balance: 500,
  frozenBalance: 0,
  save: mock(async (_options?: unknown): Promise<void> => {}),
  ...overrides,
});

const makeService = (
  id: string,
  overrides: Partial<FakeService> = {},
): FakeService => ({
  id,
  title: 'Logo design',
  freelancerId: 'freelancer-1',
  freelancer: { userId: 'freelancer-user-1' },
  ...overrides,
});

// Compare results without fighting the service's narrow `as const` return types.
const plain = (value: unknown): unknown => value;

// ───────────────────────── tests ─────────────────────────

describe('PaymentsService', () => {
  let transaction: FakeTransaction;
  let sequelize: FakeSequelize;
  let paymentSchema: FakePaymentSchema;
  let orderSchema: FakeOrderSchema;
  let userSchema: FakeUserSchema;
  let serviceSchema: FakeServiceSchema;
  let contractSchema: FakeContractSchema;
  let notificationsService: FakeNotificationsService;
  let contractQueue: FakeContractQueue;
  let service: PaymentsService;

  beforeEach(() => {
    spyOn(Validator, 'validate').mockReturnValue(makeValidation(true));
    // rechargeBalance logs its progress
    spyOn(console, 'log').mockImplementation(() => {});
    spyOn(console, 'error').mockImplementation(() => {});

    transaction = {
      commit: mock(async (): Promise<void> => {}),
      rollback: mock(async (): Promise<void> => {}),
      LOCK: { UPDATE: 'UPDATE' },
    };
    sequelize = {
      transaction: mock(async (): Promise<FakeTransaction> => transaction),
    };
    paymentSchema = {
      create: mock(
        async (_data: unknown, _options: unknown): Promise<{ id: string }> => ({
          id: paymentId,
        }),
      ),
      findOne: mock(
        async (_options: unknown): Promise<{ id: string } | null> => null,
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
    };
    orderSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeOrder | null> => null,
      ),
    };
    userSchema = {
      findByPk: mock(
        async (_id: string, _options?: unknown): Promise<FakeUser | null> =>
          null,
      ),
    };
    serviceSchema = {
      findAll: mock(async (_options: unknown): Promise<FakeService[]> => []),
    };
    contractSchema = {
      create: mock(
        async (data: unknown, _options: unknown): Promise<FakeContract> => {
          const { serviceId } = data as { serviceId: string };

          return {
            id: `contract-${serviceId}`,
            serviceId,
            deadline: new Date(Date.now() + DAY_MS),
          };
        },
      ),
    };
    notificationsService = {
      create: mock(async (_data: unknown): Promise<void> => {}),
    };
    contractQueue = {
      add: mock(
        async (
          _name: string,
          _data: unknown,
          _options: unknown,
        ): Promise<void> => {},
      ),
    };

    service = new PaymentsService(
      paymentSchema as unknown as typeof PaymentSchema,
      orderSchema as unknown as typeof OrderSchema,
      userSchema as unknown as typeof UserSchema,
      serviceSchema as unknown as typeof ServiceSchema,
      contractSchema as unknown as typeof ContractSchema,
      notificationsService as unknown as NotificationsService,
      contractQueue as unknown as ContractQueue,
      sequelize as unknown as Sequelize,
    );
  });

  afterEach(() => {
    mock.restore();
  });

  // ───────────────────────── pay ─────────────────────────
  describe('pay', () => {
    // Everything is in place for a successful payment; each test breaks one thing.
    let order: FakeOrder;
    let user: FakeUser;

    beforeEach(() => {
      order = makeOrder();
      user = makeUser();
      orderSchema.findOne.mockResolvedValue(order);
      userSchema.findByPk.mockResolvedValue(user);
      serviceSchema.findAll.mockResolvedValue([makeService('service-1')]);
    });

    it("returns 404 and rolls back when the order isn't the client's", async () => {
      orderSchema.findOne.mockResolvedValue(null);

      const result = await service.pay(userId, orderId);

      expect(orderSchema.findOne).toHaveBeenCalledWith({
        where: { id: orderId, clientId: userId },
        transaction,
        lock: 'UPDATE',
      });
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'Order not found',
      });
      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(userSchema.findByPk).not.toHaveBeenCalled();
    });

    it("returns 400 when the order isn't awaiting payment", async () => {
      order.status = Object.values(OrderStatus).find(
        (status) => status !== OrderStatus.PENDING_PAYMENT,
      ) as OrderStatus;

      const result = await service.pay(userId, orderId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'This order cannot be processed in its current status.',
      });
      expect(userSchema.findByPk).not.toHaveBeenCalled();
    });

    it("returns 404 when the user doesn't exist", async () => {
      userSchema.findByPk.mockResolvedValue(null);

      const result = await service.pay(userId, orderId);

      expect(userSchema.findByPk).toHaveBeenCalledWith(userId, {
        transaction,
        lock: 'UPDATE',
      });
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'User not found',
      });
    });

    it('returns 400 when the order amount is invalid', async () => {
      order.totalAmount = 0;

      const result = await service.pay(userId, orderId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Invalid order amount.',
      });
      expect(user.save).not.toHaveBeenCalled();
      expect(paymentSchema.create).not.toHaveBeenCalled();
    });

    it("returns 400 and keeps the balance when it can't cover the order", async () => {
      user.balance = 50;

      const result = await service.pay(userId, orderId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Insufficient balance to complete this payment.',
      });
      expect(user.balance).toBe(50);
      expect(user.save).not.toHaveBeenCalled();
      expect(paymentSchema.create).not.toHaveBeenCalled();
    });

    it('returns 400 when the order already has a completed payment', async () => {
      paymentSchema.findOne.mockResolvedValue({ id: 'existing-payment' });

      const result = await service.pay(userId, orderId);

      expect(paymentSchema.findOne).toHaveBeenCalledWith({
        where: { orderId, status: PaymentStatus.COMPLETED },
        transaction,
        lock: 'UPDATE',
      });
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'This order has already been paid for.',
      });
      expect(user.save).not.toHaveBeenCalled();
    });

    it('moves the amount from the balance to the frozen balance', async () => {
      user.balance = '500.00';
      user.frozenBalance = '20.00';

      await service.pay(userId, orderId);

      expect(Number(user.balance)).toBe(400);
      expect(Number(user.frozenBalance)).toBe(120);
      expect(user.save).toHaveBeenCalledWith({ transaction });
    });

    it('creates a held payment for the order total', async () => {
      order.totalAmount = '100.00';

      await service.pay(userId, orderId);

      expect(paymentSchema.create).toHaveBeenCalledWith(
        {
          orderId,
          userId,
          amount: 100,
          status: PaymentStatus.HELD,
          paidAt: expect.any(Date),
        },
        { transaction },
      );
    });

    it('loads the services of the order with their freelancer', async () => {
      order.services = [
        { id: 'service-1', price: 60, deliveryDays: 3 },
        { id: 'service-2', price: 40, deliveryDays: 5 },
      ];
      serviceSchema.findAll.mockResolvedValue([
        makeService('service-1'),
        makeService('service-2'),
      ]);

      await service.pay(userId, orderId);

      expect(serviceSchema.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: ['service-1', 'service-2'] },
          include: [expect.objectContaining({ attributes: ['id', 'userId'] })],
          transaction,
        }),
      );
    });

    it('returns 404 when a service of the order no longer exists', async () => {
      order.services = [
        { id: 'service-1', price: 60, deliveryDays: 3 },
        { id: 'service-2', price: 40, deliveryDays: 5 },
      ];
      serviceSchema.findAll.mockResolvedValue([makeService('service-1')]);

      const result = await service.pay(userId, orderId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'One or more services in this order could not be found.',
      });
      expect(contractSchema.create).not.toHaveBeenCalled();
      expect(transaction.commit).not.toHaveBeenCalled();
    });

    it("returns 400 when a loaded service isn't part of the order snapshot", async () => {
      serviceSchema.findAll.mockResolvedValue([makeService('other-service')]);
      // same number of services, but a different id than the order's snapshot

      const result = await service.pay(userId, orderId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Service details are missing from this order.',
      });
      expect(contractSchema.create).not.toHaveBeenCalled();
    });

    it('creates an in-progress contract per service from the order snapshot', async () => {
      order.services = [
        { id: 'service-1', price: 60, deliveryDays: 3 },
        { id: 'service-2', price: 40, deliveryDays: 5 },
      ];
      serviceSchema.findAll.mockResolvedValue([
        makeService('service-1', { freelancerId: 'freelancer-1' }),
        makeService('service-2', { freelancerId: 'freelancer-2' }),
      ]);

      await service.pay(userId, orderId);

      expect(contractSchema.create).toHaveBeenCalledTimes(2);
      expect(contractSchema.create).toHaveBeenCalledWith(
        {
          orderId,
          serviceId: 'service-1',
          freelancerId: 'freelancer-1',
          clientId: userId,
          amount: 60,
          deliveryDays: 3,
          deadline: expect.any(Date),
          status: ContractStatus.IN_PROGRESS,
        },
        { transaction },
      );
      expect(contractSchema.create).toHaveBeenCalledWith(
        expect.objectContaining({
          serviceId: 'service-2',
          freelancerId: 'freelancer-2',
          amount: 40,
          deliveryDays: 5,
        }),
        { transaction },
      );
    });

    it('sets each deadline deliveryDays from now', async () => {
      const earliest = new Date();
      earliest.setDate(earliest.getDate() + 3);

      await service.pay(userId, orderId);

      const latest = new Date();
      latest.setDate(latest.getDate() + 3);

      const [data] = contractSchema.create.mock.calls[0] ?? [];
      const { deadline } = data as { deadline: Date };

      expect(deadline.getTime()).toBeGreaterThanOrEqual(earliest.getTime());
      expect(deadline.getTime()).toBeLessThanOrEqual(latest.getTime());
    });

    it('moves the order to in progress and commits once', async () => {
      await service.pay(userId, orderId);

      expect(order.status).toBe(OrderStatus.IN_PROGRESS);
      expect(order.save).toHaveBeenCalledWith({ transaction });
      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(transaction.rollback).not.toHaveBeenCalled();
    });

    it('notifies each freelancer about the purchase after the commit', async () => {
      await service.pay(userId, orderId);

      expect(notificationsService.create).toHaveBeenCalledTimes(1);
      expect(notificationsService.create).toHaveBeenCalledWith({
        senderId: userId,
        receiverId: 'freelancer-user-1',
        targetId: 'contract-service-1',
        type: NotificationType.PAYMENT,
        message: 'A client has purchased your service "Logo design".',
        link: '/contract/contract-service-1',
      });
      expect(transaction.commit.mock.invocationCallOrder[0]).toBeLessThan(
        notificationsService.create.mock.invocationCallOrder[0] ?? 0,
      );
    });

    it('schedules a delayed expire job per contract after the commit', async () => {
      contractSchema.create.mockResolvedValue({
        id: 'contract-1',
        serviceId: 'service-1',
        deadline: new Date(Date.now() + 60_000),
      });

      await service.pay(userId, orderId);

      expect(contractQueue.add).toHaveBeenCalledTimes(1);
      expect(contractQueue.add).toHaveBeenCalledWith(
        'expire-contract',
        { contractId: 'contract-1' },
        { delay: expect.any(Number), jobId: 'expire-contract-contract-1' },
      );

      const [, , options] = contractQueue.add.mock.calls[0] ?? [];
      const { delay } = options as { delay: number };

      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeLessThanOrEqual(60_000);
      expect(transaction.commit.mock.invocationCallOrder[0]).toBeLessThan(
        contractQueue.add.mock.invocationCallOrder[0] ?? 0,
      );
    });

    it('never uses a negative delay when the deadline is already past', async () => {
      contractSchema.create.mockResolvedValue({
        id: 'contract-1',
        serviceId: 'service-1',
        deadline: new Date(Date.now() - 60_000),
      });

      await service.pay(userId, orderId);

      expect(contractQueue.add).toHaveBeenCalledWith(
        'expire-contract',
        { contractId: 'contract-1' },
        expect.objectContaining({ delay: 0 }),
      );
    });

    it('returns the created payment', async () => {
      const payment = { id: 'created-payment' };
      paymentSchema.create.mockResolvedValue(payment);

      const result = await service.pay(userId, orderId);

      expect(plain(result)).toEqual({
        success: true,
        message: 'Payment completed successfully',
        data: payment,
      });
    });

    it('rolls back and rethrows when something fails before the commit', async () => {
      contractSchema.create.mockRejectedValue(new Error('boom'));

      await expect(service.pay(userId, orderId)).rejects.toThrow('boom');

      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(transaction.commit).not.toHaveBeenCalled();
      expect(contractQueue.add).not.toHaveBeenCalled();
    });

    it("doesn't roll back when something fails after the commit", async () => {
      notificationsService.create.mockRejectedValue(new Error('boom'));

      await expect(service.pay(userId, orderId)).rejects.toThrow('boom');

      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(transaction.rollback).not.toHaveBeenCalled();
      expect(contractQueue.add).not.toHaveBeenCalled();
    });

    it.todo(
      'rolls back the transaction on every early return (only the order-not-found branch rolls back today; bad status, user not found, invalid amount, low balance and existing payment leave it open)',
    );

    it.todo(
      "doesn't leave the frozen balance and the payment uncommitted when the services check fails (404 / 400 after the money moved)",
    );

    it.todo(
      'rejects an order that already has a HELD payment (the duplicate check only looks for COMPLETED, but pay() creates HELD)',
    );
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('uses the default page and limit when none are given', async () => {
      await service.findAll();

      expect(paymentSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 0,
          order: [['createdAt', 'DESC']],
          distinct: true,
        }),
      );
    });

    it('derives the offset from the page and limit', async () => {
      await service.findAll(3, 5);

      expect(paymentSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 5, offset: 10 }),
      );
    });

    it('includes the user and the order with only their public fields', async () => {
      await service.findAll();

      expect(paymentSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: [
            expect.objectContaining({
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email'],
            }),
            expect.objectContaining({
              as: 'order',
              attributes: ['id', 'totalAmount', 'status', 'createdAt'],
            }),
          ],
        }),
      );
    });

    it('returns the payments with their pagination', async () => {
      const rows = [{ id: 'p1' }, { id: 'p2' }];
      paymentSchema.findAndCountAll.mockResolvedValue({ rows, count: 12 });

      const result = await service.findAll(2, 5);

      expect(plain(result)).toEqual({
        success: true,
        data: rows,
        pagination: buildPagination(12, 2, 5),
      });
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it("returns the user's payments with their order, newest first", async () => {
      const payments = [{ id: 'p1' }, { id: 'p2' }];
      paymentSchema.findAll.mockResolvedValue(payments);

      const result = await service.findMe(userId);

      expect(paymentSchema.findAll).toHaveBeenCalledWith({
        where: { userId },
        include: [
          expect.objectContaining({
            as: 'order',
            attributes: ['id', 'totalAmount', 'status', 'createdAt'],
          }),
        ],
        order: [['createdAt', 'DESC']],
      });
      expect(plain(result)).toEqual({ success: true, data: payments });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it("returns an error when the payment isn't the user's", async () => {
      paymentSchema.findOne.mockResolvedValue(null);

      const result = await service.findOne(userId, paymentId);

      expect(paymentSchema.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: paymentId, userId } }),
      );
      expect(plain(result)).toEqual({
        error: true,
        message: 'Payment not found',
      });
    });

    it('returns the payment', async () => {
      const payment = { id: paymentId };
      paymentSchema.findOne.mockResolvedValue(payment);

      const result = await service.findOne(userId, paymentId);

      expect(plain(result)).toEqual({ success: true, data: payment });
    });
  });

  // ───────────────────────── rechargeBalance ─────────────────────────
  describe('rechargeBalance', () => {
    it('validates the amount with the recharge balance rule', async () => {
      await service.rechargeBalance(userId, 100);

      expect(Validator.validate).toHaveBeenCalledWith(
        { amount: 100 },
        RechargeBalanceRule,
      );
    });

    it('returns 422 with the errors and never opens a transaction when the validation fails', async () => {
      const errors = [{ field: 'amount', message: 'Amount is invalid' }];
      spyOn(Validator, 'validate').mockReturnValue(
        makeValidation(false, errors),
      );

      const result = await service.rechargeBalance(userId, 0);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors,
      });
      expect(sequelize.transaction).not.toHaveBeenCalled();
      expect(userSchema.findByPk).not.toHaveBeenCalled();
    });

    it("returns 404 and rolls back when the user doesn't exist", async () => {
      userSchema.findByPk.mockResolvedValue(null);

      const result = await service.rechargeBalance(userId, 100);

      expect(userSchema.findByPk).toHaveBeenCalledWith(userId, {
        transaction,
        lock: 'UPDATE',
      });
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'User not found',
      });
      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(transaction.commit).not.toHaveBeenCalled();
    });

    it('adds the amount to the balance, saves, commits and returns the new balance', async () => {
      const user = makeUser({ balance: '500.00' });
      userSchema.findByPk.mockResolvedValue(user);

      const result = await service.rechargeBalance(userId, 150);

      expect(user.balance).toBe(650);
      expect(user.save).toHaveBeenCalledWith({ transaction });
      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(transaction.rollback).not.toHaveBeenCalled();
      expect(plain(result)).toEqual({
        success: true,
        message: 'The balance has been successfully topped up.',
        data: { amount: 150, balance: 650 },
      });
    });

    it('rolls back and rethrows when saving fails', async () => {
      const user = makeUser();
      user.save.mockRejectedValue(new Error('boom'));
      userSchema.findByPk.mockResolvedValue(user);

      await expect(service.rechargeBalance(userId, 100)).rejects.toThrow(
        'boom',
      );

      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(transaction.commit).not.toHaveBeenCalled();
    });

    it('rethrows the original error even when the rollback fails', async () => {
      const user = makeUser();
      user.save.mockRejectedValue(new Error('boom'));
      userSchema.findByPk.mockResolvedValue(user);
      transaction.rollback.mockRejectedValue(new Error('rollback failed'));

      await expect(service.rechargeBalance(userId, 100)).rejects.toThrow(
        'boom',
      );
    });
  });
});
