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
import { Op, type Sequelize } from 'sequelize';
import type { RedisManager } from '../../../config/db/redis/redis';
import { buildPagination } from '../../../utilities/pagination';
import type { FreelancerSchema } from '../../freelancers/schemas/freelancer.schema';
import type { NotificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../notifications/schemas/enums/notification.enum';
import { OrderStatus } from '../../orders/schemas/enums/order.enum';
import type { OrderSchema } from '../../orders/schemas/order.schema';
import { PaymentStatus } from '../../payments/schemas/enums/payment.enum';
import type { PaymentSchema } from '../../payments/schemas/payment.schema';
import type { PlatformWalletSchema } from '../../platform-wallets/schemas/platform-wallet.schema';
import type { ServiceSchema } from '../../services/schemas/service.schema';
import { UserRole } from '../../users/schemas/enums/users.enum';
import type { UserSchema } from '../../users/schemas/user.schema';
import { ContractsService } from '../contracts.service';
import type { ContractSchema } from '../schemas/contract.schema';
import { ContractStatus } from '../schemas/enums/contract.enum';

// ───────────────────────── types ─────────────────────────

type SaveMock = Mock<(options?: unknown) => Promise<void>>;

interface FakeContract {
  id: string;
  clientId: string;
  freelancerId: string;
  orderId: string;
  serviceId: string;
  amount: number | string;
  status: ContractStatus;
  deadline: Date;
  completedAt: Date | null;
  deliveredAt: Date | null;
  save: SaveMock;
}

interface FakeUser {
  id: string;
  balance: number | string;
  frozenBalance: number | string;
  save: SaveMock;
}

interface FakeFreelancer {
  id: string;
  userId: string;
  completedOrders: number;
  save: SaveMock;
}

interface FakeOrder {
  id: string;
  status: unknown;
  save: SaveMock;
}

interface FakeServiceRecord {
  id: string;
  ordersCount: number;
  save: SaveMock;
}

interface FakePayment {
  id: string;
  status: unknown;
  save: SaveMock;
}

interface FakeWallet {
  key: string;
  balance: number | string;
  save: SaveMock;
}

interface FakeTransaction {
  commit: Mock<() => Promise<void>>;
  rollback: Mock<() => Promise<void>>;
  LOCK: { UPDATE: string };
}

interface FakeSequelize {
  transaction: Mock<() => Promise<FakeTransaction>>;
}

interface FakeContractSchema {
  findAll: Mock<(options: unknown) => Promise<unknown[]>>;
  findAndCountAll: Mock<
    (options: unknown) => Promise<{ rows: unknown[]; count: number }>
  >;
  findOne: Mock<(options: unknown) => Promise<FakeContract | null>>;
  findByPk: Mock<
    (id: string, options?: unknown) => Promise<FakeContract | null>
  >;
}

interface FakeUserSchema {
  findOne: Mock<(options: unknown) => Promise<FakeUser | null>>;
  findByPk: Mock<(id: string, options?: unknown) => Promise<FakeUser | null>>;
}

interface FakeFreelancerSchema {
  findByPk: Mock<
    (id: string, options?: unknown) => Promise<FakeFreelancer | null>
  >;
}

interface FakeOrderSchema {
  findOne: Mock<(options: unknown) => Promise<FakeOrder | null>>;
  findByPk: Mock<(id: string, options?: unknown) => Promise<FakeOrder | null>>;
}

interface FakeServiceSchema {
  findByPk: Mock<
    (id: string, options?: unknown) => Promise<FakeServiceRecord | null>
  >;
}

interface FakePlatformWalletSchema {
  findOne: Mock<(options: unknown) => Promise<FakeWallet | null>>;
  create: Mock<(data: unknown, options?: unknown) => Promise<FakeWallet>>;
}

interface FakePaymentSchema {
  findOne: Mock<(options: unknown) => Promise<FakePayment | null>>;
}

interface FakeNotificationsService {
  create: Mock<(data: unknown) => Promise<void>>;
}

interface FakeRedis {
  del: Mock<(key: string) => Promise<void>>;
}

// ───────────────────────── helpers ─────────────────────────

const userId = 'user-1';
const contractId = 'contract-1';
const clientId = 'client-1';
const freelancerId = 'freelancer-1';
const freelancerUserId = 'freelancer-user-1';
const orderId = 'order-1';
const serviceId = 'service-1';

const minutesFromNow = (minutes: number): Date =>
  new Date(Date.now() + minutes * 60_000);

const makeSave = (): SaveMock =>
  mock(async (_options?: unknown): Promise<void> => {});

const makeContract = (overrides: Partial<FakeContract> = {}): FakeContract => ({
  id: contractId,
  clientId,
  freelancerId,
  orderId,
  serviceId,
  amount: 100,
  status: ContractStatus.IN_PROGRESS,
  deadline: minutesFromNow(-1),
  completedAt: null,
  deliveredAt: null,
  save: makeSave(),
  ...overrides,
});

const makeUser = (overrides: Partial<FakeUser> = {}): FakeUser => ({
  id: clientId,
  balance: 0,
  frozenBalance: 0,
  save: makeSave(),
  ...overrides,
});

const makeFreelancer = (
  overrides: Partial<FakeFreelancer> = {},
): FakeFreelancer => ({
  id: freelancerId,
  userId: freelancerUserId,
  completedOrders: 3,
  save: makeSave(),
  ...overrides,
});

const makeOrder = (overrides: Partial<FakeOrder> = {}): FakeOrder => ({
  id: orderId,
  status: 'initial',
  save: makeSave(),
  ...overrides,
});

const makeServiceRecord = (
  overrides: Partial<FakeServiceRecord> = {},
): FakeServiceRecord => ({
  id: serviceId,
  ordersCount: 7,
  save: makeSave(),
  ...overrides,
});

const makePayment = (overrides: Partial<FakePayment> = {}): FakePayment => ({
  id: 'payment-1',
  status: 'initial',
  save: makeSave(),
  ...overrides,
});

const makeWallet = (overrides: Partial<FakeWallet> = {}): FakeWallet => ({
  key: 'platform',
  balance: 0,
  save: makeSave(),
  ...overrides,
});

// Compare results without fighting the service's narrow `as const` return types.
const plain = (value: unknown): unknown => value;

// ───────────────────────── tests ─────────────────────────

describe('ContractsService', () => {
  let contractSchema: FakeContractSchema;
  let userSchema: FakeUserSchema;
  let freelancerSchema: FakeFreelancerSchema;
  let orderSchema: FakeOrderSchema;
  let serviceSchema: FakeServiceSchema;
  let platformWalletSchema: FakePlatformWalletSchema;
  let paymentSchema: FakePaymentSchema;
  let notificationsService: FakeNotificationsService;
  let redisManager: FakeRedis;
  let sequelize: FakeSequelize;
  let transaction: FakeTransaction;
  let service: ContractsService;

  let logSpy: Mock<typeof console.log>;
  let errorSpy: Mock<typeof console.error>;

  beforeEach(() => {
    transaction = {
      commit: mock(async (): Promise<void> => {}),
      rollback: mock(async (): Promise<void> => {}),
      LOCK: { UPDATE: 'UPDATE' },
    };
    sequelize = {
      transaction: mock(async (): Promise<FakeTransaction> => transaction),
    };

    contractSchema = {
      findAll: mock(async (_options: unknown): Promise<unknown[]> => []),
      findAndCountAll: mock(
        async (
          _options: unknown,
        ): Promise<{ rows: unknown[]; count: number }> => ({
          rows: [],
          count: 0,
        }),
      ),
      findOne: mock(
        async (_options: unknown): Promise<FakeContract | null> => null,
      ),
      findByPk: mock(
        async (_id: string, _options?: unknown): Promise<FakeContract | null> =>
          null,
      ),
    };
    userSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeUser | null> => null,
      ),
      findByPk: mock(
        async (_id: string, _options?: unknown): Promise<FakeUser | null> =>
          null,
      ),
    };
    freelancerSchema = {
      findByPk: mock(
        async (
          _id: string,
          _options?: unknown,
        ): Promise<FakeFreelancer | null> => null,
      ),
    };
    orderSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeOrder | null> => null,
      ),
      findByPk: mock(
        async (_id: string, _options?: unknown): Promise<FakeOrder | null> =>
          null,
      ),
    };
    serviceSchema = {
      findByPk: mock(
        async (
          _id: string,
          _options?: unknown,
        ): Promise<FakeServiceRecord | null> => null,
      ),
    };
    platformWalletSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeWallet | null> => null,
      ),
      create: mock(
        async (_data: unknown, _options?: unknown): Promise<FakeWallet> =>
          makeWallet(),
      ),
    };
    paymentSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakePayment | null> => null,
      ),
    };
    notificationsService = {
      create: mock(async (_data: unknown): Promise<void> => {}),
    };
    redisManager = {
      del: mock(async (_key: string): Promise<void> => {}),
    };

    logSpy = spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = spyOn(console, 'error').mockImplementation(() => {});

    service = new ContractsService(
      contractSchema as unknown as typeof ContractSchema,
      userSchema as unknown as typeof UserSchema,
      freelancerSchema as unknown as typeof FreelancerSchema,
      orderSchema as unknown as typeof OrderSchema,
      serviceSchema as unknown as typeof ServiceSchema,
      platformWalletSchema as unknown as typeof PlatformWalletSchema,
      paymentSchema as unknown as typeof PaymentSchema,
      notificationsService as unknown as NotificationsService,
      redisManager as unknown as RedisManager,
      sequelize as unknown as Sequelize,
    );
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it('returns the contracts where the user is the client or the freelancer', async () => {
      const contracts = [{ id: 'c1' }, { id: 'c2' }];
      contractSchema.findAll.mockResolvedValue(contracts);

      const result = await service.findMe(userId);

      expect(contractSchema.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            [Op.or]: [{ clientId: userId }, { '$freelancer.userId$': userId }],
          },
          order: [['createdAt', 'DESC']],
        }),
      );
      expect(plain(result)).toEqual({ success: true, data: contracts });
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('paginates the contracts and returns the pagination info', async () => {
      const rows = [{ id: 'c1' }];
      contractSchema.findAndCountAll.mockResolvedValue({ rows, count: 25 });

      const result = await service.findAll(2, 5, 5);

      expect(contractSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 5,
          offset: 5,
          distinct: true,
          order: [['createdAt', 'DESC']],
        }),
      );
      expect(plain(result)).toEqual({
        success: true,
        data: rows,
        pagination: buildPagination(25, 2, 5),
      });
    });

    it('defaults to page 1 with a limit of 10', async () => {
      await service.findAll();

      expect(contractSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10, offset: 0 }),
      );
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('returns the contract when the user is a party of it', async () => {
      const contract = makeContract();
      contractSchema.findOne.mockResolvedValue(contract);

      const result = await service.findOne(userId, contractId);

      expect(contractSchema.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: contractId,
            [Op.or]: [{ clientId: userId }, { '$freelancer.userId$': userId }],
          },
        }),
      );
      expect(plain(result)).toEqual({ success: true, data: contract });
    });

    it('returns an error when the contract is not found', async () => {
      contractSchema.findOne.mockResolvedValue(null);

      const result = await service.findOne(userId, contractId);

      expect(plain(result)).toEqual({
        error: true,
        message: 'Contract not found',
      });
    });
  });

  // ───────────────────────── expireContract ─────────────────────────
  describe('expireContract', () => {
    const arrange = (overrides: Partial<FakeContract> = {}) => {
      const contract = makeContract(overrides);
      const freelancer = makeFreelancer();
      const client = makeUser({
        id: clientId,
        balance: 50,
        frozenBalance: 100,
      });
      const order = makeOrder();
      const payment = makePayment();
      const admin = makeUser({ id: 'admin-1' });

      contractSchema.findByPk.mockResolvedValue(contract);
      freelancerSchema.findByPk.mockResolvedValue(freelancer);
      userSchema.findByPk.mockResolvedValue(client);
      // The service loads the order with `orderSchema.findByPk`.
      orderSchema.findByPk.mockResolvedValue(order);
      paymentSchema.findOne.mockResolvedValue(payment);
      userSchema.findOne.mockResolvedValue(admin);

      return { contract, freelancer, client, order, payment, admin };
    };

    const expectRolledBack = async (message: string) => {
      await expect(service.expireContract(contractId)).rejects.toThrow(message);
      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(transaction.commit).not.toHaveBeenCalled();
    };

    it('locks the contract row inside the transaction', async () => {
      arrange();

      await service.expireContract(contractId);

      expect(contractSchema.findByPk).toHaveBeenCalledWith(contractId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
    });

    it('loads the order by primary key with a row lock', async () => {
      const { contract } = arrange();

      await service.expireContract(contractId);

      expect(orderSchema.findByPk).toHaveBeenCalledWith(contract.orderId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
    });

    it('throws and rolls back when the contract does not exist', async () => {
      contractSchema.findByPk.mockResolvedValue(null);

      await expectRolledBack('Contract not found');
    });

    it('does nothing when the contract is no longer in progress', async () => {
      const { contract, client } = arrange({
        status: ContractStatus.DELIVERED,
      });

      const result = await service.expireContract(contractId);

      expect(plain(result)).toBe(contract);
      expect(contract.status).toBe(ContractStatus.DELIVERED);
      expect(client.save).not.toHaveBeenCalled();
      expect(freelancerSchema.findByPk).not.toHaveBeenCalled();
      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(transaction.rollback).not.toHaveBeenCalled();
    });

    it('does nothing when the deadline has not passed yet', async () => {
      const { contract, client } = arrange({ deadline: minutesFromNow(30) });

      const result = await service.expireContract(contractId);

      expect(plain(result)).toBe(contract);
      expect(contract.status).toBe(ContractStatus.IN_PROGRESS);
      expect(client.save).not.toHaveBeenCalled();
      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(transaction.rollback).not.toHaveBeenCalled();
    });

    it('throws and rolls back when the freelancer is missing', async () => {
      arrange();
      freelancerSchema.findByPk.mockResolvedValue(null);

      await expectRolledBack('Freelancer not found');
    });

    it('throws and rolls back when the client is missing', async () => {
      arrange();
      userSchema.findByPk.mockResolvedValue(null);

      await expectRolledBack('Client not found');
    });

    it('throws and rolls back when the order is missing', async () => {
      arrange();
      orderSchema.findByPk.mockResolvedValue(null);

      await expectRolledBack('Order not found');
    });

    it('throws and rolls back when the payment is missing', async () => {
      arrange();
      paymentSchema.findOne.mockResolvedValue(null);

      await expectRolledBack('Payment not found');
    });

    it('throws and rolls back when the contract amount is invalid', async () => {
      arrange({ amount: 0 });

      await expectRolledBack('Invalid contract amount');
    });

    it('throws and rolls back when the amount is not a number', async () => {
      arrange({ amount: 'not-a-number' });

      await expectRolledBack('Invalid contract amount');
    });

    it("throws and rolls back when the frozen balance can't cover the refund", async () => {
      const { client } = arrange({ amount: 100 });
      client.frozenBalance = 50;

      await expectRolledBack('Insufficient frozen balance for refund');
      expect(client.save).not.toHaveBeenCalled();
    });

    it('refunds the client, expires the contract and commits', async () => {
      const { contract, client, order, payment } = arrange({ amount: 100 });

      const result = await service.expireContract(contractId);

      expect(client.balance).toBe(150);
      expect(client.frozenBalance).toBe(0);
      expect(contract.status).toBe(ContractStatus.EXPIRED);
      expect(payment.status).toBe(PaymentStatus.REFUNDED);
      expect(order.status).toBe(OrderStatus.REFUNDED);

      expect(client.save).toHaveBeenCalledWith({ transaction });
      expect(contract.save).toHaveBeenCalledWith({ transaction });
      expect(payment.save).toHaveBeenCalledWith({ transaction });
      expect(order.save).toHaveBeenCalledWith({ transaction });

      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(transaction.rollback).not.toHaveBeenCalled();
      expect(plain(result)).toBe(contract);
    });

    it('clears the cached contracts of both parties after the commit', async () => {
      arrange();

      await service.expireContract(contractId);

      expect(redisManager.del).toHaveBeenCalledTimes(4);
      expect(redisManager.del).toHaveBeenCalledWith(`contracts:me:${clientId}`);
      expect(redisManager.del).toHaveBeenCalledWith(
        `contracts:me:${freelancerUserId}`,
      );
      expect(redisManager.del).toHaveBeenCalledWith(
        `contracts:one:${clientId}:${contractId}`,
      );
      expect(redisManager.del).toHaveBeenCalledWith(
        `contracts:one:${freelancerUserId}:${contractId}`,
      );
    });

    it('notifies both the client and the freelancer from the admin', async () => {
      const { admin } = arrange();

      await service.expireContract(contractId);

      expect(userSchema.findOne).toHaveBeenCalledWith({
        where: { role: UserRole.ADMIN },
      });
      expect(notificationsService.create).toHaveBeenCalledTimes(2);
      expect(notificationsService.create).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          senderId: admin.id,
          receiverId: clientId,
          targetId: contractId,
          type: NotificationType.CONTRACT_EXPIRED,
          link: `/contract/${contractId}`,
        }),
      );
      expect(notificationsService.create).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          senderId: admin.id,
          receiverId: freelancerUserId,
          targetId: contractId,
          type: NotificationType.CONTRACT_EXPIRED,
          link: `/contract/${contractId}`,
        }),
      );
    });

    it('skips notifications when there is no admin user', async () => {
      const { contract } = arrange();
      userSchema.findOne.mockResolvedValue(null);

      const result = await service.expireContract(contractId);

      expect(notificationsService.create).not.toHaveBeenCalled();
      expect(plain(result)).toBe(contract);
    });

    it('does not fail or roll back when post-commit work throws', async () => {
      const { contract } = arrange();
      redisManager.del.mockRejectedValue(new Error('redis down'));

      const result = await service.expireContract(contractId);

      expect(plain(result)).toBe(contract);
      expect(contract.status).toBe(ContractStatus.EXPIRED);
      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(transaction.rollback).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });

    it('rolls back and rethrows when saving fails before the commit', async () => {
      const { client } = arrange();
      client.save.mockRejectedValue(new Error('db down'));

      await expectRolledBack('db down');
    });
  });

  // ───────────────────────── complete ─────────────────────────
  // `complete` returns `{ error, statusCode, message }` for the missing / invalid
  // cases and only throws (after rolling the transaction back) for the insufficient
  // frozen balance and for unexpected errors such as a failing save.
  describe('complete', () => {
    const arrange = (overrides: Partial<FakeContract> = {}) => {
      const contract = makeContract({
        status: ContractStatus.DELIVERED,
        ...overrides,
      });
      const order = makeOrder();
      const serviceRecord = makeServiceRecord({ ordersCount: 7 });
      const client = makeUser({ id: clientId, balance: 0, frozenBalance: 100 });
      const freelancer = makeFreelancer({ completedOrders: 3 });
      const freelancerUser = makeUser({
        id: freelancerUserId,
        balance: 10,
        frozenBalance: 0,
      });
      const wallet = makeWallet({ balance: 20 });
      const payment = makePayment();
      const admin = makeUser({ id: 'admin-1' });

      contractSchema.findOne.mockResolvedValue(contract);
      orderSchema.findByPk.mockResolvedValue(order);
      serviceSchema.findByPk.mockResolvedValue(serviceRecord);
      userSchema.findByPk.mockImplementation(
        async (id: string): Promise<FakeUser | null> => {
          if (id === client.id) return client;
          if (id === freelancerUser.id) return freelancerUser;
          return null;
        },
      );
      freelancerSchema.findByPk.mockResolvedValue(freelancer);
      platformWalletSchema.findOne.mockResolvedValue(wallet);
      paymentSchema.findOne.mockResolvedValue(payment);
      userSchema.findOne.mockResolvedValue(admin);

      return {
        contract,
        order,
        serviceRecord,
        client,
        freelancer,
        freelancerUser,
        wallet,
        payment,
        admin,
      };
    };

    // The service answers with an error object (no throw).
    const expectError = async (statusCode: number, message: string) => {
      const result = await service.complete(userId, contractId);

      expect(plain(result)).toEqual({ error: true, statusCode, message });
      expect(transaction.commit).not.toHaveBeenCalled();
      expect(notificationsService.create).not.toHaveBeenCalled();
    };

    // The service throws after rolling the transaction back.
    const expectRolledBack = async (message: string) => {
      await expect(service.complete(userId, contractId)).rejects.toThrow(
        message,
      );
      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(transaction.commit).not.toHaveBeenCalled();
      expect(notificationsService.create).not.toHaveBeenCalled();
    };

    it("returns 404 when the contract doesn't belong to the client", async () => {
      contractSchema.findOne.mockResolvedValue(null);

      await expectError(404, 'Contract not found');

      expect(contractSchema.findOne).toHaveBeenCalledWith({
        where: { id: contractId, clientId: userId },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
    });

    it("returns 400 when the contract hasn't been delivered", async () => {
      arrange({ status: ContractStatus.IN_PROGRESS });

      await expectError(400, 'Only delivered contracts can be completed.');
    });

    it('returns 404 when the order is missing', async () => {
      arrange();
      orderSchema.findByPk.mockResolvedValue(null);

      await expectError(404, 'Order not found');
    });

    it('returns 404 when the service is missing', async () => {
      arrange();
      serviceSchema.findByPk.mockResolvedValue(null);

      await expectError(404, 'Service not found');
    });

    it('returns 404 when the client is missing', async () => {
      const { freelancerUser } = arrange();
      userSchema.findByPk.mockImplementation(
        async (id: string): Promise<FakeUser | null> =>
          id === freelancerUser.id ? freelancerUser : null,
      );

      await expectError(404, 'Client not found');
    });

    it('returns 404 when the freelancer is missing', async () => {
      arrange();
      freelancerSchema.findByPk.mockResolvedValue(null);

      await expectError(404, 'Freelancer not found');
    });

    it("returns 404 when the freelancer's user is missing", async () => {
      const { client } = arrange();
      userSchema.findByPk.mockImplementation(
        async (id: string): Promise<FakeUser | null> =>
          id === client.id ? client : null,
      );

      await expectError(404, 'Freelancer user not found');
    });

    it('returns 404 when the payment is missing', async () => {
      const { order, client } = arrange();
      paymentSchema.findOne.mockResolvedValue(null);

      await expectError(404, 'Payment not found');

      // The payment is looked up with the loaded client's id and the order's id.
      expect(paymentSchema.findOne).toHaveBeenCalledWith({
        where: { userId: client.id, orderId: order.id },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
    });

    it('returns 400 when the contract amount is invalid', async () => {
      arrange({ amount: 0 });

      await expectError(400, 'Invalid contract amount');
    });

    it("throws and rolls back when the frozen balance can't cover the amount", async () => {
      const { client } = arrange({ amount: 100 });
      client.frozenBalance = 50;

      await expectRolledBack(
        'Insufficient frozen balance to complete this operation.',
      );
      expect(client.save).not.toHaveBeenCalled();
    });

    it("creates the platform wallet when it doesn't exist yet", async () => {
      arrange();
      const createdWallet = makeWallet({ balance: 0 });
      platformWalletSchema.findOne.mockResolvedValue(null);
      platformWalletSchema.create.mockResolvedValue(createdWallet);

      await service.complete(userId, contractId);

      expect(platformWalletSchema.create).toHaveBeenCalledWith(
        { key: 'platform', balance: 0 },
        { transaction },
      );
      expect(createdWallet.balance).toBe(5);
      expect(createdWallet.save).toHaveBeenCalledWith({ transaction });
    });

    it('splits the payment (5% commission), updates every record and commits', async () => {
      const {
        contract,
        order,
        serviceRecord,
        client,
        freelancer,
        freelancerUser,
        wallet,
        payment,
      } = arrange({ amount: 100 });

      const result = await service.complete(userId, contractId);

      expect(client.frozenBalance).toBe(0);
      expect(freelancerUser.balance).toBe(105);
      expect(wallet.balance).toBe(25);
      expect(freelancer.completedOrders).toBe(4);
      expect(serviceRecord.ordersCount).toBe(8);

      expect(contract.status).toBe(ContractStatus.COMPLETED);
      expect(contract.completedAt).toBeInstanceOf(Date);
      expect(order.status).toBe(OrderStatus.COMPLETED);
      expect(payment.status).toBe(PaymentStatus.COMPLETED);

      for (const record of [
        client,
        freelancerUser,
        freelancer,
        wallet,
        order,
        serviceRecord,
        contract,
        payment,
      ]) {
        expect(record.save).toHaveBeenCalledWith({ transaction });
      }

      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(transaction.rollback).not.toHaveBeenCalled();
      expect(plain(result)).toEqual({
        success: true,
        message: 'Contract completed successfully',
        data: contract,
      });
    });

    it('notifies the freelancer and the client from the admin', async () => {
      const { admin, contract, freelancerUser, client } = arrange();

      await service.complete(userId, contractId);

      expect(notificationsService.create).toHaveBeenCalledTimes(2);
      expect(notificationsService.create).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          senderId: admin.id,
          receiverId: freelancerUser.id,
          targetId: contract.id,
          type: NotificationType.CONTRACT_COMPLETED,
        }),
      );
      expect(notificationsService.create).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          senderId: admin.id,
          receiverId: client.id,
          targetId: contract.id,
          type: NotificationType.CONTRACT_COMPLETED,
          link: `/contract/${contract.id}`,
        }),
      );
    });

    it('skips notifications when there is no admin user', async () => {
      arrange();
      userSchema.findOne.mockResolvedValue(null);

      const result = await service.complete(userId, contractId);

      expect(notificationsService.create).not.toHaveBeenCalled();
      expect(plain(result)).toMatchObject({ success: true });
    });

    it("doesn't fail or roll back when the post-commit notification throws", async () => {
      const { contract } = arrange();
      notificationsService.create.mockRejectedValue(new Error('notify down'));

      const result = await service.complete(userId, contractId);

      expect(plain(result)).toMatchObject({ success: true, data: contract });
      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(transaction.rollback).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });

    it('rolls back and rethrows when saving fails', async () => {
      const { client } = arrange();
      client.save.mockRejectedValue(new Error('db down'));

      await expect(service.complete(userId, contractId)).rejects.toThrow(
        'db down',
      );

      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(transaction.commit).not.toHaveBeenCalled();
      expect(notificationsService.create).not.toHaveBeenCalled();
    });

    it.todo(
      'rolls back the transaction when it returns an error object (the early returns leave the transaction open and the row locks held today)',
    );
  });

  // ───────────────────────── deliver ─────────────────────────
  describe('deliver', () => {
    it("returns 404 when the contract doesn't belong to the freelancer", async () => {
      contractSchema.findOne.mockResolvedValue(null);

      const result = await service.deliver(userId, contractId);

      expect(contractSchema.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: contractId },
          include: [
            expect.objectContaining({ as: 'freelancer', where: { userId } }),
          ],
        }),
      );
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: 'Contract not found',
      });
    });

    it("returns 400 when the contract isn't in progress", async () => {
      contractSchema.findOne.mockResolvedValue(
        makeContract({ status: ContractStatus.DELIVERED }),
      );

      const result = await service.deliver(userId, contractId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: 'Only contracts in progress can be completed.',
      });
    });

    it('returns 400 when the deadline has already passed', async () => {
      const contract = makeContract({ deadline: minutesFromNow(-5) });
      contractSchema.findOne.mockResolvedValue(contract);

      const result = await service.deliver(userId, contractId);

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message:
          'The contract deadline has expired. Delivery is no longer allowed.',
      });
      expect(contract.save).not.toHaveBeenCalled();
      expect(notificationsService.create).not.toHaveBeenCalled();
    });

    it('marks the contract as delivered and notifies the client', async () => {
      const contract = makeContract({ deadline: minutesFromNow(60) });
      contractSchema.findOne.mockResolvedValue(contract);

      const result = await service.deliver(userId, contractId);

      expect(contract.status).toBe(ContractStatus.DELIVERED);
      expect(contract.deliveredAt).toBeInstanceOf(Date);
      expect(contract.save).toHaveBeenCalledTimes(1);
      expect(notificationsService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          senderId: userId,
          receiverId: clientId,
          targetId: contractId,
          type: NotificationType.CONTRACT_DELIVERED,
          link: `/contract/${contractId}`,
        }),
      );
      expect(plain(result)).toEqual({
        success: true,
        message: 'Contract delivered successfully.',
        data: contract,
      });
    });
  });
});
