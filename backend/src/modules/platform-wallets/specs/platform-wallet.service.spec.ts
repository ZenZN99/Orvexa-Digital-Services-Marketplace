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
import { PlatformWalletService } from '../platform-wallet.service.js';
import { PlatformWallet } from '../schema/platform-wallet.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { messages } from '../../../common/libs/messages.js';
import { UserRole } from '../../../common/enums/user.enum.js';

vi.mock('../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('PlatformWalletService', () => {
  let service: PlatformWalletService;

  const platformWalletModel = { findOne: vi.fn() };
  const userModel = { findOne: vi.fn() };
  const sequelize = { transaction: vi.fn() };

  let transaction: {
    commit: Mock;
    rollback: Mock;
    LOCK: { UPDATE: string };
  };

  const makeWallet = (balance: number | string) => ({
    balance,
    save: vi.fn().mockResolvedValue(undefined),
  });

  const makeAdmin = (balance: number | string) => ({
    id: 'admin-1',
    balance,
    save: vi.fn().mockResolvedValue(undefined),
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
        PlatformWalletService,
        {
          provide: getModelToken(PlatformWallet),
          useValue: platformWalletModel,
        },
        { provide: getModelToken(User), useValue: userModel },
        { provide: Sequelize, useValue: sequelize },
      ],
    }).compile();

    service = module.get(PlatformWalletService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── findBalance ─────────────────────────
  describe('findBalance', () => {
    it('should throw NotFoundException if wallet not found', async () => {
      platformWalletModel.findOne.mockResolvedValue(null);

      await expect(service.findBalance()).rejects.toThrow(
        new NotFoundException(messages.platformWallet.notFound),
      );
    });

    it('should return the wallet balance as a number', async () => {
      platformWalletModel.findOne.mockResolvedValue({ balance: '125.50' });

      const result = await service.findBalance();

      expect(result).toEqual({ data: { balance: 125.5 }, message: null });
    });
  });

  // ───────────────────────── withdraw ─────────────────────────
  describe('withdraw', () => {
    it('should rollback and throw NotFoundException if wallet not found', async () => {
      platformWalletModel.findOne.mockResolvedValue(null);

      await expect(service.withdraw('admin-1', 50)).rejects.toThrow(
        new NotFoundException(messages.platformWallet.notFound),
      );
      expect(platformWalletModel.findOne).toHaveBeenCalledWith({
        transaction,
        lock: 'UPDATE',
      });
      expect(userModel.findOne).not.toHaveBeenCalled();
      expect(transaction.rollback).toHaveBeenCalled();
      expect(transaction.commit).not.toHaveBeenCalled();
    });

    it('should rollback and throw NotFoundException if admin not found', async () => {
      platformWalletModel.findOne.mockResolvedValue(makeWallet(100));
      userModel.findOne.mockResolvedValue(null);

      await expect(service.withdraw('admin-1', 50)).rejects.toThrow(
        new NotFoundException(messages.user.adminNotFound),
      );
      expect(userModel.findOne).toHaveBeenCalledWith({
        where: { id: 'admin-1', role: UserRole.ADMIN },
        transaction,
        lock: 'UPDATE',
      });
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should rollback and throw BadRequestException if wallet balance is insufficient', async () => {
      const wallet = makeWallet(30);
      const admin = makeAdmin(0);
      platformWalletModel.findOne.mockResolvedValue(wallet);
      userModel.findOne.mockResolvedValue(admin);

      await expect(service.withdraw('admin-1', 50)).rejects.toThrow(
        new BadRequestException(
          messages.platformWallet.withdraw.insufficientBalance,
        ),
      );
      expect(wallet.save).not.toHaveBeenCalled();
      expect(admin.save).not.toHaveBeenCalled();
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should move money from the platform wallet to the admin and commit', async () => {
      const wallet = makeWallet('100');
      const admin = makeAdmin('20');
      platformWalletModel.findOne.mockResolvedValue(wallet);
      userModel.findOne.mockResolvedValue(admin);

      const result = await service.withdraw('admin-1', 40);

      expect(wallet.balance).toBe(60);
      expect(admin.balance).toBe(60);
      expect(wallet.save).toHaveBeenCalledWith({ transaction });
      expect(admin.save).toHaveBeenCalledWith({ transaction });
      expect(transaction.commit).toHaveBeenCalled();
      expect(transaction.rollback).not.toHaveBeenCalled();
      expect(result).toEqual({
        data: { amount: 40, platformBalance: 60, adminBalance: 60 },
        message: messages.platformWallet.withdraw.success,
      });
    });

    it('should allow withdrawing the entire wallet balance', async () => {
      const wallet = makeWallet(100);
      const admin = makeAdmin(0);
      platformWalletModel.findOne.mockResolvedValue(wallet);
      userModel.findOne.mockResolvedValue(admin);

      const result = await service.withdraw('admin-1', 100);

      expect(wallet.balance).toBe(0);
      expect(admin.balance).toBe(100);
      expect(result.data).toEqual({
        amount: 100,
        platformBalance: 0,
        adminBalance: 100,
      });
    });

    it('should rollback if saving fails', async () => {
      const wallet = makeWallet(100);
      const admin = makeAdmin(0);
      admin.save.mockRejectedValue(new Error('db error'));
      platformWalletModel.findOne.mockResolvedValue(wallet);
      userModel.findOne.mockResolvedValue(admin);

      await expect(service.withdraw('admin-1', 10)).rejects.toThrow('db error');
      expect(transaction.rollback).toHaveBeenCalled();
      expect(transaction.commit).not.toHaveBeenCalled();
    });
  });
});
