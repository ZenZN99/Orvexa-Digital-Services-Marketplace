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
import { ContractService } from '../contract.service.js';
import { Contract } from '../schema/contract.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';
import { PlatformWallet } from '../../platform-wallets/schema/platform-wallet.schema.js';
import { NotificationService } from '../../notifications/notification.service.js';
import { RedisHelper } from '../../../infrastructure/database/redis/redis.helper.js';
import { messages } from '../../../common/libs/messages.js';
import { ContractStatus } from '../../../common/enums/contract.enum.js';
import { OrderStatus } from '../../../common/enums/order.enum.js';
import { NotificationType } from '../../../common/enums/notification.enum.js';

vi.mock('../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('ContractService', () => {
  let service: ContractService;

  const contractModel = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    findByPk: vi.fn(),
    findAndCountAll: vi.fn(),
  };
  const userModel = { findByPk: vi.fn(), findOne: vi.fn() };
  const freelancerModel = { findByPk: vi.fn() };
  const platformWalletModel = { findOne: vi.fn(), create: vi.fn() };
  const sequelize = { transaction: vi.fn() };
  const notificationService = { create: vi.fn() };
  const redis = { getJSON: vi.fn(), set: vi.fn() };

  let transaction: {
    commit: Mock;
    rollback: Mock;
    LOCK: { UPDATE: string };
  };

  const FIVE_MIN = 5 * 60;

  const makeContract = (overrides: Record<string, unknown> = {}) => ({
    id: 'contract-1',
    clientId: 'client-1',
    freelancerId: 'freelancer-1',
    status: ContractStatus.IN_PROGRESS,
    amount: 100,
    deadline: new Date(Date.now() - 60_000), // already passed
    deliveredAt: null as Date | null,
    completedAt: null as Date | null,
    freelancer: { id: 'freelancer-1', userId: 'freelancer-user-1' },
    order: { status: 'initial' as unknown },
    service: { ordersCount: 0 },
    save: vi.fn().mockResolvedValue(undefined),
    ...overrides,
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
        ContractService,
        { provide: getModelToken(Contract), useValue: contractModel },
        { provide: getModelToken(User), useValue: userModel },
        { provide: getModelToken(Freelancer), useValue: freelancerModel },
        {
          provide: getModelToken(PlatformWallet),
          useValue: platformWalletModel,
        },
        { provide: Sequelize, useValue: sequelize },
        { provide: NotificationService, useValue: notificationService },
        { provide: RedisHelper, useValue: redis },
      ],
    }).compile();

    service = module.get(ContractService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── findMe ─────────────────────────
  describe('findMe', () => {
    it('should return cached contracts when they exist', async () => {
      const cached = [{ id: 'c1' }];
      redis.getJSON.mockResolvedValue(cached);

      const result = await service.findMe('user-1');

      expect(redis.getJSON).toHaveBeenCalledWith('contracts:me:user-1');
      expect(contractModel.findAll).not.toHaveBeenCalled();
      expect(result).toEqual({ data: cached, message: null });
    });

    it('should query DB and cache the result on cache miss', async () => {
      const contracts = [{ id: 'c1' }, { id: 'c2' }];
      redis.getJSON.mockResolvedValue(null);
      contractModel.findAll.mockResolvedValue(contracts);

      const result = await service.findMe('user-1');

      expect(contractModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ order: [['createdAt', 'DESC']] }),
      );
      expect(redis.set).toHaveBeenCalledWith(
        'contracts:me:user-1',
        contracts,
        FIVE_MIN,
      );
      expect(result).toEqual({ data: contracts, message: null });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    const key = 'contracts:one:user-1:contract-1';

    it('should return cached contract when it exists', async () => {
      const cached = { id: 'contract-1' };
      redis.getJSON.mockResolvedValue(cached);

      const result = await service.findOne('user-1', 'contract-1');

      expect(redis.getJSON).toHaveBeenCalledWith(key);
      expect(contractModel.findOne).not.toHaveBeenCalled();
      expect(result).toEqual({ data: cached, message: null });
    });

    it('should throw NotFoundException if contract not found', async () => {
      redis.getJSON.mockResolvedValue(null);
      contractModel.findOne.mockResolvedValue(null);

      await expect(service.findOne('user-1', 'contract-1')).rejects.toThrow(
        new NotFoundException(messages.contract.notFound),
      );
      expect(redis.set).not.toHaveBeenCalled();
    });

    it('should return the contract and cache it', async () => {
      const contract = { id: 'contract-1' };
      redis.getJSON.mockResolvedValue(null);
      contractModel.findOne.mockResolvedValue(contract);

      const result = await service.findOne('user-1', 'contract-1');

      expect(redis.set).toHaveBeenCalledWith(key, contract, FIVE_MIN);
      expect(result).toEqual({ data: contract, message: null });
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('should return cached result when it exists', async () => {
      const cached = { contracts: [], pagination: {} };
      redis.getJSON.mockResolvedValue(cached);

      const result = await service.findAll(2, 5);

      expect(redis.getJSON).toHaveBeenCalledWith('contracts:all:2:5');
      expect(contractModel.findAndCountAll).not.toHaveBeenCalled();
      expect(result).toEqual({ data: cached, message: null });
    });

    it('should paginate, compute pagination info and cache on miss', async () => {
      const rows = [{ id: 'c1' }];
      redis.getJSON.mockResolvedValue(null);
      contractModel.findAndCountAll.mockResolvedValue({ rows, count: 25 });

      const result = await service.findAll(2, 10);

      expect(contractModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 10,
          distinct: true,
          order: [['createdAt', 'DESC']],
        }),
      );
      const expected = {
        contracts: rows,
        pagination: {
          total: 25,
          page: 2,
          limit: 10,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: true,
        },
      };
      expect(redis.set).toHaveBeenCalledWith(
        'contracts:all:2:10',
        expected,
        FIVE_MIN,
      );
      expect(result).toEqual({ data: expected, message: null });
    });

    it('should use default page=1 and limit=10', async () => {
      redis.getJSON.mockResolvedValue(null);
      contractModel.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      const result = await service.findAll();

      expect(contractModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10, offset: 0 }),
      );
      expect(result.data.pagination).toEqual(
        expect.objectContaining({
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }),
      );
    });
  });

  // ───────────────────────── expire ─────────────────────────
  describe('expire', () => {
    it('should rollback and throw NotFoundException if contract not found', async () => {
      contractModel.findByPk.mockResolvedValue(null);

      await expect(service.expire('contract-1')).rejects.toThrow(
        new NotFoundException(messages.contract.notFound),
      );
      expect(transaction.rollback).toHaveBeenCalled();
      expect(transaction.commit).not.toHaveBeenCalled();
    });

    it('should commit and return alreadyProcessed if status is not IN_PROGRESS', async () => {
      const contract = makeContract({ status: ContractStatus.DELIVERED });
      contractModel.findByPk.mockResolvedValue(contract);

      const result = await service.expire('contract-1');

      expect(transaction.commit).toHaveBeenCalled();
      expect(userModel.findByPk).not.toHaveBeenCalled();
      expect(result).toEqual({
        data: contract,
        message: messages.contract.expire.alreadyProcessed,
      });
    });

    it('should commit and return notDue if deadline has not passed', async () => {
      const contract = makeContract({
        deadline: new Date(Date.now() + 60 * 60 * 1000),
      });
      contractModel.findByPk.mockResolvedValue(contract);

      const result = await service.expire('contract-1');

      expect(transaction.commit).toHaveBeenCalled();
      expect(contract.save).not.toHaveBeenCalled();
      expect(result).toEqual({
        data: contract,
        message: messages.contract.expire.notDue,
      });
    });

    it('should rollback and throw NotFoundException if client not found', async () => {
      contractModel.findByPk.mockResolvedValue(makeContract());
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.expire('contract-1')).rejects.toThrow(
        new NotFoundException(messages.user.notFound),
      );
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should refund the client, expire the contract and notify both parties', async () => {
      const contract = makeContract();
      const client = {
        id: 'client-1',
        balance: 20,
        frozenBalance: 100,
        save: vi.fn().mockResolvedValue(undefined),
      };
      contractModel.findByPk.mockResolvedValue(contract);
      userModel.findByPk.mockResolvedValue(client);
      userModel.findOne.mockResolvedValue({ id: 'admin-1' });

      const result = await service.expire('contract-1');

      expect(client.balance).toBe(120);
      expect(client.frozenBalance).toBe(0);
      expect(client.save).toHaveBeenCalledWith({ transaction });
      expect(contract.status).toBe(ContractStatus.EXPIRED);
      expect(contract.save).toHaveBeenCalledWith({ transaction });
      expect(transaction.commit).toHaveBeenCalled();
      expect(transaction.rollback).not.toHaveBeenCalled();

      expect(notificationService.create).toHaveBeenCalledTimes(2);
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          senderId: 'admin-1',
          receiverId: 'client-1',
          targetId: 'contract-1',
          type: NotificationType.CONTRACT_EXPIRED,
        }),
      );
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          receiverId: 'freelancer-user-1',
          link: '/contract/contract-1',
        }),
      );
      expect(result).toEqual({
        data: contract,
        message: messages.contract.expire.success,
      });
    });

    it('should not send notifications when no admin exists', async () => {
      const client = {
        id: 'client-1',
        balance: 0,
        frozenBalance: 100,
        save: vi.fn(),
      };
      contractModel.findByPk.mockResolvedValue(makeContract());
      userModel.findByPk.mockResolvedValue(client);
      userModel.findOne.mockResolvedValue(null);

      const result = await service.expire('contract-1');

      expect(notificationService.create).not.toHaveBeenCalled();
      expect(result.message).toBe(messages.contract.expire.success);
    });
  });

  // ───────────────────────── complete ─────────────────────────
  describe('complete', () => {
    const buildHappyPath = () => {
      const contract = makeContract({ status: ContractStatus.DELIVERED });
      const client = {
        id: 'client-1',
        frozenBalance: 100,
        save: vi.fn().mockResolvedValue(undefined),
      };
      const freelancer = {
        id: 'freelancer-1',
        userId: 'freelancer-user-1',
        completedOrders: 2,
        save: vi.fn().mockResolvedValue(undefined),
      };
      const freelancerUser = {
        id: 'freelancer-user-1',
        balance: 50,
        save: vi.fn().mockResolvedValue(undefined),
      };
      const wallet = {
        balance: 10,
        save: vi.fn().mockResolvedValue(undefined),
      };

      contractModel.findOne.mockResolvedValue(contract);
      userModel.findByPk.mockImplementation(async (id: string) =>
        id === 'client-1'
          ? client
          : id === 'freelancer-user-1'
            ? freelancerUser
            : null,
      );
      freelancerModel.findByPk.mockResolvedValue(freelancer);
      platformWalletModel.findOne.mockResolvedValue(wallet);
      userModel.findOne.mockResolvedValue({ id: 'admin-1' });

      return { contract, client, freelancer, freelancerUser, wallet };
    };

    it('should rollback and throw NotFoundException if contract not found', async () => {
      contractModel.findOne.mockResolvedValue(null);

      await expect(service.complete('client-1', 'contract-1')).rejects.toThrow(
        new NotFoundException(messages.contract.notFound),
      );
      expect(contractModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'contract-1', clientId: 'client-1' },
          transaction,
        }),
      );
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw BadRequestException if contract is not DELIVERED', async () => {
      contractModel.findOne.mockResolvedValue(makeContract());

      await expect(service.complete('client-1', 'contract-1')).rejects.toThrow(
        new BadRequestException(messages.contract.complete.invalidStatus),
      );
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw NotFoundException if client not found', async () => {
      contractModel.findOne.mockResolvedValue(
        makeContract({ status: ContractStatus.DELIVERED }),
      );
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.complete('client-1', 'contract-1')).rejects.toThrow(
        new NotFoundException(messages.user.notFound),
      );
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw NotFoundException if freelancer not found', async () => {
      contractModel.findOne.mockResolvedValue(
        makeContract({ status: ContractStatus.DELIVERED }),
      );
      userModel.findByPk.mockResolvedValue({ id: 'client-1' });
      freelancerModel.findByPk.mockResolvedValue(null);

      await expect(service.complete('client-1', 'contract-1')).rejects.toThrow(
        new NotFoundException(messages.freelancer.notFound),
      );
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw NotFoundException if freelancer user not found', async () => {
      contractModel.findOne.mockResolvedValue(
        makeContract({ status: ContractStatus.DELIVERED }),
      );
      userModel.findByPk
        .mockResolvedValueOnce({ id: 'client-1' })
        .mockResolvedValueOnce(null);
      freelancerModel.findByPk.mockResolvedValue({
        userId: 'freelancer-user-1',
      });

      await expect(service.complete('client-1', 'contract-1')).rejects.toThrow(
        new NotFoundException(messages.user.notFound),
      );
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw BadRequestException if client frozen balance is insufficient', async () => {
      const { client } = buildHappyPath();
      client.frozenBalance = 50;

      await expect(service.complete('client-1', 'contract-1')).rejects.toThrow(
        new BadRequestException(
          messages.contract.complete.insufficientFrozenBalance,
        ),
      );
      expect(client.save).not.toHaveBeenCalled();
      expect(transaction.rollback).toHaveBeenCalled();
      expect(transaction.commit).not.toHaveBeenCalled();
    });

    it('should create the platform wallet if it does not exist', async () => {
      const { wallet } = buildHappyPath();
      platformWalletModel.findOne.mockResolvedValue(null);
      platformWalletModel.create.mockResolvedValue(wallet);

      await service.complete('client-1', 'contract-1');

      expect(platformWalletModel.create).toHaveBeenCalledWith(
        { key: 'platform', balance: 0 },
        { transaction },
      );
    });

    it('should split payment (5% commission), update entities, commit and notify', async () => {
      const { contract, client, freelancer, freelancerUser, wallet } =
        buildHappyPath();

      const result = await service.complete('client-1', 'contract-1');

      expect(client.frozenBalance).toBe(0);
      expect(freelancerUser.balance).toBe(145); // 50 + (100 - 5)
      expect(wallet.balance).toBe(15); // 10 + 5
      expect(freelancer.completedOrders).toBe(3);
      expect(contract.status).toBe(ContractStatus.COMPLETED);
      expect(contract.order.status).toBe(OrderStatus.COMPLETED);
      expect(contract.service.ordersCount).toBe(1);
      expect(contract.completedAt).toBeInstanceOf(Date);

      for (const entity of [
        client,
        freelancerUser,
        freelancer,
        wallet,
        contract,
      ]) {
        expect(entity.save).toHaveBeenCalledWith({ transaction });
      }
      expect(transaction.commit).toHaveBeenCalled();
      expect(transaction.rollback).not.toHaveBeenCalled();

      expect(notificationService.create).toHaveBeenCalledTimes(2);
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          senderId: 'admin-1',
          receiverId: 'freelancer-user-1',
          type: NotificationType.CONTRACT_COMPLETED,
        }),
      );
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          receiverId: 'client-1',
          link: '/contract/contract-1',
        }),
      );
      expect(result).toEqual({
        data: contract,
        message: messages.contract.complete.success,
      });
    });

    it('should not notify anyone when no admin exists', async () => {
      buildHappyPath();
      userModel.findOne.mockResolvedValue(null);

      await service.complete('client-1', 'contract-1');

      expect(transaction.commit).toHaveBeenCalled();
      expect(notificationService.create).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────── deliver ─────────────────────────
  describe('deliver', () => {
    it('should throw NotFoundException if contract not found', async () => {
      contractModel.findOne.mockResolvedValue(null);

      await expect(
        service.deliver('freelancer-user-1', 'contract-1'),
      ).rejects.toThrow(new NotFoundException(messages.contract.notFound));
    });

    it('should throw BadRequestException if contract is not IN_PROGRESS', async () => {
      contractModel.findOne.mockResolvedValue(
        makeContract({ status: ContractStatus.DELIVERED }),
      );

      await expect(
        service.deliver('freelancer-user-1', 'contract-1'),
      ).rejects.toThrow(
        new BadRequestException(messages.contract.deliver.invalidStatus),
      );
    });

    it('should mark contract as DELIVERED, save and notify the client', async () => {
      const contract = makeContract();
      contractModel.findOne.mockResolvedValue(contract);

      const result = await service.deliver('freelancer-user-1', 'contract-1');

      expect(contractModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'contract-1' } }),
      );
      expect(contract.status).toBe(ContractStatus.DELIVERED);
      expect(contract.deliveredAt).toBeInstanceOf(Date);
      expect(contract.save).toHaveBeenCalled();
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          senderId: 'freelancer-user-1',
          receiverId: 'client-1',
          targetId: 'contract-1',
          type: NotificationType.CONTRACT_DELIVERED,
          link: '/contract/contract-1',
        }),
      );
      expect(result).toEqual({
        data: contract,
        message: messages.contract.deliver.success,
      });
    });
  });
});
