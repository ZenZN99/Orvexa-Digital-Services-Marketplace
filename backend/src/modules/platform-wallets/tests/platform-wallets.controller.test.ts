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
import { Validator, type SpongHandler } from 'riser-bob';
import type { Sequelize } from 'sequelize';
import { UserRole } from '../../users/schemas/enums/users.enum';
import type { UserSchema } from '../../users/schemas/user.schema';
import { PlatformWalletsController } from '../platform-wallets.controller';
import { UpdateAmountRule } from '../rules/update-amount';
import type { PlatformWalletSchema } from '../schemas/platform-wallet.schema';

// ───────────────────────── types ─────────────────────────

type SpongReq = Parameters<SpongHandler>[0];
type SpongRes = Parameters<SpongHandler>[1];

type ValidationResult = ReturnType<typeof Validator.validate>;

interface FakeTransaction {
  commit: Mock<() => Promise<void>>;
  rollback: Mock<() => Promise<void>>;
  LOCK: { UPDATE: string };
}

interface FakeSequelize {
  transaction: Mock<() => Promise<FakeTransaction>>;
}

interface FakeBalanceHolder {
  balance: string | number;
  save: Mock<(options?: unknown) => Promise<void>>;
}

interface FakePlatformWalletSchema {
  findOne: Mock<(options?: unknown) => Promise<FakeBalanceHolder | null>>;
}

interface FakeUserSchema {
  findOne: Mock<(options: unknown) => Promise<FakeBalanceHolder | null>>;
}

interface Tagged {
  type: string;
  payload: unknown;
}

interface FakeSpongRes {
  SpongOK: Mock<(payload: unknown) => Tagged>;
  SpongBadRequest: Mock<(payload: unknown) => Tagged>;
  SpongNotFound: Mock<(payload: unknown) => Tagged>;
  SpongUnprocessableContent: Mock<(payload: unknown) => Tagged>;
}

// ───────────────────────── helpers ─────────────────────────

const adminId = 'admin-1';

const makeReq = (options: { body?: unknown } = {}) => {
  const json = mock(async (): Promise<unknown> => options.body);
  const req = {
    user: { id: adminId },
    params: {},
    json,
  } as unknown as SpongReq;

  return { req, json };
};

const makeBalanceHolder = (balance: string | number): FakeBalanceHolder => ({
  balance,
  save: mock(async (_options?: unknown): Promise<void> => {}),
});

const makeValidation = (valid: boolean, errors: unknown = []) =>
  ({ valid, errors }) as unknown as ValidationResult;

const tagged = (type: string) =>
  mock((payload: unknown): Tagged => ({ type, payload }));

// Handlers are typed as returning `void | Response`; in these tests they return the
// tagged objects produced by the fake SpongRes.
const asTagged = (result: unknown): Tagged => result as Tagged;

const walletNotFoundPayload = {
  success: false,
  message: 'Platform wallet not found',
};

// ───────────────────────── tests ─────────────────────────

describe('PlatformWalletsController', () => {
  let transaction: FakeTransaction;
  let sequelize: FakeSequelize;
  let platformWalletSchema: FakePlatformWalletSchema;
  let userSchema: FakeUserSchema;
  let spongRes: FakeSpongRes;
  let res: SpongRes;
  let controller: PlatformWalletsController;
  let validateSpy: Mock<typeof Validator.validate>;

  beforeEach(() => {
    validateSpy = spyOn(Validator, 'validate');
    validateSpy.mockReturnValue(makeValidation(true));

    transaction = {
      commit: mock(async (): Promise<void> => {}),
      rollback: mock(async (): Promise<void> => {}),
      LOCK: { UPDATE: 'UPDATE' },
    };
    sequelize = {
      transaction: mock(async (): Promise<FakeTransaction> => transaction),
    };
    platformWalletSchema = {
      findOne: mock(
        async (_options?: unknown): Promise<FakeBalanceHolder | null> => null,
      ),
    };
    userSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeBalanceHolder | null> => null,
      ),
    };

    spongRes = {
      SpongOK: tagged('ok'),
      SpongBadRequest: tagged('bad-request'),
      SpongNotFound: tagged('not-found'),
      SpongUnprocessableContent: tagged('unprocessable'),
    };
    res = spongRes as unknown as SpongRes;

    controller = new PlatformWalletsController(
      platformWalletSchema as unknown as typeof PlatformWalletSchema,
      userSchema as unknown as typeof UserSchema,
      sequelize as unknown as Sequelize,
    );
  });

  afterEach(() => {
    validateSpy.mockRestore();
  });

  // ───────────────────────── findBalance ─────────────────────────
  describe('findBalance', () => {
    it("returns 404 when the platform wallet doesn't exist", async () => {
      platformWalletSchema.findOne.mockResolvedValue(null);

      const result = await controller.findBalance(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: walletNotFoundPayload,
      });
    });

    it('returns the wallet balance as a number', async () => {
      platformWalletSchema.findOne.mockResolvedValue(
        makeBalanceHolder('250.50'),
      );

      const result = await controller.findBalance(makeReq().req, res);

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: { success: true, data: { balance: 250.5 } },
      });
    });
  });

  // ───────────────────────── withdraw ─────────────────────────
  describe('withdraw', () => {
    // Wallet and admin exist and the wallet can cover the amount; each test breaks one thing.
    let wallet: FakeBalanceHolder;
    let admin: FakeBalanceHolder;

    beforeEach(() => {
      wallet = makeBalanceHolder('200.00');
      admin = makeBalanceHolder('10.00');
      platformWalletSchema.findOne.mockResolvedValue(wallet);
      userSchema.findOne.mockResolvedValue(admin);
    });

    it('validates the parsed amount with the update amount rule', async () => {
      const { req, json } = makeReq({ body: { amount: 50 } });

      await controller.withdraw(req, res);

      expect(json).toHaveBeenCalledTimes(1);
      expect(validateSpy).toHaveBeenCalledWith(
        { amount: 50 },
        UpdateAmountRule,
      );
    });

    it('returns 422 with the validation errors and never opens a transaction', async () => {
      const errors = [{ field: 'amount', message: 'Amount is invalid' }];
      validateSpy.mockReturnValue(makeValidation(false, errors));

      const result = await controller.withdraw(
        makeReq({ body: { amount: 0.5 } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'unprocessable',
        payload: { success: false, message: 'Validation failed', errors },
      });
      expect(sequelize.transaction).not.toHaveBeenCalled();
      expect(platformWalletSchema.findOne).not.toHaveBeenCalled();
    });

    it("returns 404 and rolls back when the platform wallet doesn't exist", async () => {
      platformWalletSchema.findOne.mockResolvedValue(null);

      const result = await controller.withdraw(
        makeReq({ body: { amount: 50 } }).req,
        res,
      );

      expect(platformWalletSchema.findOne).toHaveBeenCalledWith({
        transaction,
        lock: 'UPDATE',
      });
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: walletNotFoundPayload,
      });
      expect(userSchema.findOne).not.toHaveBeenCalled();
      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(transaction.commit).not.toHaveBeenCalled();
    });

    it("returns 404 and rolls back when the current user isn't an admin", async () => {
      userSchema.findOne.mockResolvedValue(null);

      const result = await controller.withdraw(
        makeReq({ body: { amount: 50 } }).req,
        res,
      );

      expect(userSchema.findOne).toHaveBeenCalledWith({
        where: { id: adminId, role: UserRole.ADMIN },
        transaction,
        lock: 'UPDATE',
      });
      expect(asTagged(result)).toEqual({
        type: 'not-found',
        payload: { success: false, message: 'Admin not found' },
      });
      expect(wallet.save).not.toHaveBeenCalled();
      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(transaction.commit).not.toHaveBeenCalled();
    });

    it("returns 400, rolls back and keeps both balances when the wallet can't cover the amount", async () => {
      wallet.balance = 40;

      const result = await controller.withdraw(
        makeReq({ body: { amount: 50 } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'bad-request',
        payload: {
          success: false,
          message:
            'Insufficient platform wallet balance to complete this operation.',
        },
      });
      expect(wallet.balance).toBe(40);
      expect(admin.balance).toBe('10.00');
      expect(wallet.save).not.toHaveBeenCalled();
      expect(admin.save).not.toHaveBeenCalled();
      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(transaction.commit).not.toHaveBeenCalled();
    });

    it('moves the amount from the platform wallet to the admin and saves both', async () => {
      await controller.withdraw(makeReq({ body: { amount: 50 } }).req, res);

      expect(wallet.balance).toBe(150);
      expect(admin.balance).toBe(60);
      expect(wallet.save).toHaveBeenCalledWith({ transaction });
      expect(admin.save).toHaveBeenCalledWith({ transaction });
    });

    it('commits once, after both balances are saved', async () => {
      await controller.withdraw(makeReq({ body: { amount: 50 } }).req, res);

      expect(transaction.commit).toHaveBeenCalledTimes(1);
      expect(transaction.rollback).not.toHaveBeenCalled();

      const commitOrder = transaction.commit.mock.invocationCallOrder[0] ?? 0;

      expect(wallet.save.mock.invocationCallOrder[0]).toBeLessThan(commitOrder);
      expect(admin.save.mock.invocationCallOrder[0]).toBeLessThan(commitOrder);
    });

    it('returns the transferred amount and both new balances', async () => {
      const result = await controller.withdraw(
        makeReq({ body: { amount: 50 } }).req,
        res,
      );

      expect(asTagged(result)).toEqual({
        type: 'ok',
        payload: {
          success: true,
          message: 'Funds transferred successfully.',
          data: { amount: 50, platformBalance: 150, adminBalance: 60 },
        },
      });
    });

    it('allows withdrawing the whole wallet balance', async () => {
      const result = await controller.withdraw(
        makeReq({ body: { amount: 200 } }).req,
        res,
      );

      expect(wallet.balance).toBe(0);
      expect(admin.balance).toBe(210);
      expect(asTagged(result).type).toBe('ok');
    });

    it('rolls back and rethrows when saving fails', async () => {
      wallet.save.mockRejectedValue(new Error('boom'));

      await expect(
        controller.withdraw(makeReq({ body: { amount: 50 } }).req, res),
      ).rejects.toThrow('boom');

      expect(transaction.rollback).toHaveBeenCalledTimes(1);
      expect(transaction.commit).not.toHaveBeenCalled();
      expect(admin.save).not.toHaveBeenCalled();
    });
  });
});
