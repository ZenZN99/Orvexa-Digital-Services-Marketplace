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
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service.js';
import { User } from '../../users/schema/user.schema.js';
import { UserProfile } from '../../profiles/user-profiles/schema/user-profile.schema.js';
import { UserVerification } from '../../user-verifications/schema/user-verification.schema.js';
import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';
import { TokenService } from '../../../infrastructure/token/token.service.js';
import { RedisHelper } from '../../../infrastructure/database/redis/redis.helper.js';
import { messages } from '../../../common/libs/messages.js';
import { UserRole } from '../../../common/enums/user.enum.js';
import { JobTitle } from '../../../common/enums/freelancer.enum.js';
import { sanitizeUser } from '../../../common/libs/sanitize-user.js';

vi.mock('bcryptjs', () => ({
  default: { hash: vi.fn(), compare: vi.fn() },
}));

vi.mock('../../../common/libs/sanitize-user.js', () => ({
  sanitizeUser: vi.fn(),
}));

vi.mock('../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('AuthService', () => {
  let service: AuthService;

  const userModel = { findOne: vi.fn(), findByPk: vi.fn(), create: vi.fn() };
  const userProfileModel = { findOne: vi.fn(), create: vi.fn() };
  const userVerificationModel = { findOne: vi.fn() };
  const freelancerModel = { create: vi.fn() };
  const tokenService = {
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn(),
    verifyRefreshToken: vi.fn(),
  };
  const redis = {
    get: vi.fn(),
    incr: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  };

  const mockRes = () =>
    ({ cookie: vi.fn(), clearCookie: vi.fn() }) as unknown as Response & {
      cookie: Mock;
      clearCookie: Mock;
    };

  const makeUser = (overrides: Record<string, unknown> = {}) => ({
    id: 'user-1',
    role: UserRole.FREELANCER,
    password: 'hashed-password',
    refreshToken: 'hashed-refresh',
    lastLoginAt: null as Date | null,
    save: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User), useValue: userModel },
        { provide: getModelToken(UserProfile), useValue: userProfileModel },
        {
          provide: getModelToken(UserVerification),
          useValue: userVerificationModel,
        },
        { provide: getModelToken(Freelancer), useValue: freelancerModel },
        { provide: TokenService, useValue: tokenService },
        { provide: RedisHelper, useValue: redis },
      ],
    }).compile();

    service = module.get(AuthService);

    tokenService.generateAccessToken.mockReturnValue('access-token');
    tokenService.generateRefreshToken.mockReturnValue('refresh-token');
    (sanitizeUser as Mock).mockImplementation((u) => ({ id: u.id }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── register ─────────────────────────
  describe('register', () => {
    const dto = {
      firstName: 'Ali',
      lastName: 'Ahmad',
      email: 'ali@test.com',
      password: 'Password123',
      role: UserRole.FREELANCER,
    } as any;

    it('should throw ConflictException if email already exists', async () => {
      userModel.findOne.mockResolvedValue({ id: 'existing' });
      const res = mockRes();

      await expect(service.register(dto, res)).rejects.toThrow(
        new ConflictException(messages.auth.register.failed),
      );
      expect(userModel.create).not.toHaveBeenCalled();
    });

    it('should register a freelancer, create profile + freelancer, set cookies', async () => {
      const newUser = makeUser();
      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(newUser);
      (bcrypt.hash as Mock)
        .mockResolvedValueOnce('hashed-password')
        .mockResolvedValueOnce('hashed-refresh-token');
      const res = mockRes();

      const result = await service.register(dto, res);

      expect(userModel.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(bcrypt.hash).toHaveBeenNthCalledWith(1, dto.password, 12);
      expect(userModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          password: 'hashed-password',
          role: UserRole.FREELANCER,
          isActive: true,
          balance: 0,
          frozenBalance: 0,
        }),
      );
      expect(userProfileModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-1', bio: 'No bio yet.' }),
      );
      expect(freelancerModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-1',
          jobTitle: JobTitle.NO_JOB_TITLE,
          skills: [],
          ratingAverage: 0,
        }),
      );
      expect(tokenService.generateAccessToken).toHaveBeenCalledWith({
        id: 'user-1',
        role: UserRole.FREELANCER,
      });
      expect(tokenService.generateRefreshToken).toHaveBeenCalledWith({
        id: 'user-1',
      });
      expect(bcrypt.hash).toHaveBeenNthCalledWith(2, 'refresh-token', 12);
      expect(newUser.refreshToken).toBe('hashed-refresh-token');
      expect(newUser.save).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'access-token',
        expect.objectContaining({ httpOnly: true }),
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh-token',
        expect.objectContaining({ httpOnly: true, path: '/' }),
      );
      expect(result).toEqual({
        data: { id: 'user-1' },
        message: messages.auth.register.success,
      });
    });

    it('should default role to FREELANCER when role is not provided', async () => {
      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(makeUser());
      (bcrypt.hash as Mock).mockResolvedValue('hashed');

      await service.register({ ...dto, role: undefined }, mockRes());

      expect(userModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.FREELANCER }),
      );
    });

    it('should NOT create a freelancer record for non-freelancer roles', async () => {
     
      const otherRole = Object.values(UserRole).find(
        (r) => r !== UserRole.FREELANCER,
      );
      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(makeUser({ role: otherRole }));
      (bcrypt.hash as Mock).mockResolvedValue('hashed');

      await service.register({ ...dto, role: otherRole }, mockRes());

      expect(userProfileModel.create).toHaveBeenCalled();
      expect(freelancerModel.create).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────── login ─────────────────────────
  describe('login', () => {
    const dto = { email: '  Ali@Test.com ', password: 'Password123' } as any;
    const key = 'auth:login:attempts:ali@test.com';

    it('should throw UnauthorizedException when attempts >= 5', async () => {
      redis.get.mockResolvedValue('5');

      await expect(service.login(dto, mockRes())).rejects.toThrow(
        UnauthorizedException,
      );
      expect(redis.get).toHaveBeenCalledWith(key);
      expect(userModel.findOne).not.toHaveBeenCalled();
    });

    it('should increment attempts and set TTL on first failure when user not found', async () => {
      redis.get.mockResolvedValue(null);
      userModel.findOne.mockResolvedValue(null);
      redis.incr.mockResolvedValue(1);

      await expect(service.login(dto, mockRes())).rejects.toThrow(
        new BadRequestException(messages.auth.login.failed),
      );
      expect(redis.incr).toHaveBeenCalledWith(key);
      expect(redis.set).toHaveBeenCalledWith(key, 1, 15 * 60);
    });

    it('should not reset TTL on subsequent failures', async () => {
      redis.get.mockResolvedValue('2');
      userModel.findOne.mockResolvedValue(null);
      redis.incr.mockResolvedValue(3);

      await expect(service.login(dto, mockRes())).rejects.toThrow(
        BadRequestException,
      );
      expect(redis.incr).toHaveBeenCalledWith(key);
      expect(redis.set).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException and count attempt when password is wrong', async () => {
      redis.get.mockResolvedValue(null);
      userModel.findOne.mockResolvedValue(makeUser());
      (bcrypt.compare as Mock).mockResolvedValue(false);
      redis.incr.mockResolvedValue(1);

      await expect(service.login(dto, mockRes())).rejects.toThrow(
        new BadRequestException(messages.auth.login.failed),
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        dto.password,
        'hashed-password',
      );
      expect(redis.incr).toHaveBeenCalledWith(key);
      expect(redis.set).toHaveBeenCalledWith(key, 1, 15 * 60);
      expect(redis.del).not.toHaveBeenCalled();
    });

    it('should login successfully, clear attempts, update user and set cookies', async () => {
      const user = makeUser();
      redis.get.mockResolvedValue('2');
      userModel.findOne.mockResolvedValue(user);
      (bcrypt.compare as Mock).mockResolvedValue(true);
      (bcrypt.hash as Mock).mockResolvedValue('new-hashed-refresh');
      const res = mockRes();

      const result = await service.login(dto, res);

      expect(redis.del).toHaveBeenCalledWith(key);
      expect(bcrypt.hash).toHaveBeenCalledWith('refresh-token', 12);
      expect(user.refreshToken).toBe('new-hashed-refresh');
      expect(user.lastLoginAt).toBeInstanceOf(Date);
      expect(user.save).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        data: { id: 'user-1' },
        message: messages.auth.login.success,
      });
    });
  });

  // ───────────────────────── logout ─────────────────────────
  describe('logout', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.logout(mockRes(), 'user-1')).rejects.toThrow(
        new UnauthorizedException(messages.auth.me.notFound),
      );
    });

    it('should clear cookies and return success', async () => {
      userModel.findByPk.mockResolvedValue(makeUser());
      const res = mockRes();

      const result = await service.logout(res, 'user-1');

      expect(res.clearCookie).toHaveBeenCalledWith(
        'token',
        expect.objectContaining({ maxAge: 0 }),
      );
      expect(res.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.objectContaining({ path: '/' }),
      );
      expect(result).toEqual({
        data: null,
        message: messages.auth.logout.success,
      });
    });
  });

  // ───────────────────────── me ─────────────────────────
  describe('me', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.me('user-1')).rejects.toThrow(
        new UnauthorizedException(messages.auth.me.notFound),
      );
    });

    it('should return user with profile and verification', async () => {
      const profile = { id: 'p1', bio: 'bio' };
      const verification = { id: 'v1', status: 'pending' };
      userModel.findByPk.mockResolvedValue(makeUser());
      userProfileModel.findOne.mockResolvedValue(profile);
      userVerificationModel.findOne.mockResolvedValue(verification);

      const result = await service.me('user-1');

      expect(userProfileModel.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        attributes: ['id', 'avatar', 'cover', 'bio'],
      });
      expect(userVerificationModel.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        attributes: ['id', 'status', 'submittedAt', 'rejectionReason'],
      });
      expect(result).toEqual({
        data: { id: 'user-1', profile, verification },
        message: null,
      });
    });
  });

  // ───────────────────────── refreshToken ─────────────────────────
  describe('refreshToken', () => {
    const reqWith = (token?: string) =>
      ({ cookies: { refreshToken: token } }) as unknown as Request;

    it('should throw if refresh token cookie is missing', async () => {
      await expect(
        service.refreshToken(reqWith(undefined), mockRes()),
      ).rejects.toThrow(new UnauthorizedException(messages.auth.unauthorized));
      expect(tokenService.verifyRefreshToken).not.toHaveBeenCalled();
    });

    it('should throw if token payload is invalid', async () => {
      tokenService.verifyRefreshToken.mockReturnValue(null);

      await expect(
        service.refreshToken(reqWith('bad'), mockRes()),
      ).rejects.toThrow(UnauthorizedException);
      expect(userModel.findByPk).not.toHaveBeenCalled();
    });

    it('should throw if user not found', async () => {
      tokenService.verifyRefreshToken.mockReturnValue({ id: 'user-1' });
      userModel.findByPk.mockResolvedValue(null);

      await expect(
        service.refreshToken(reqWith('tok'), mockRes()),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if user has no stored refresh token', async () => {
      tokenService.verifyRefreshToken.mockReturnValue({ id: 'user-1' });
      userModel.findByPk.mockResolvedValue(makeUser({ refreshToken: null }));

      await expect(
        service.refreshToken(reqWith('tok'), mockRes()),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if refresh token does not match the stored hash', async () => {
      tokenService.verifyRefreshToken.mockReturnValue({ id: 'user-1' });
      userModel.findByPk.mockResolvedValue(makeUser());
      (bcrypt.compare as Mock).mockResolvedValue(false);

      await expect(
        service.refreshToken(reqWith('tok'), mockRes()),
      ).rejects.toThrow(UnauthorizedException);
      expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
    });

    it('should issue a new access token when refresh token is valid', async () => {
      tokenService.verifyRefreshToken.mockReturnValue({ id: 'user-1' });
      userModel.findByPk.mockResolvedValue(makeUser());
      (bcrypt.compare as Mock).mockResolvedValue(true);
      const res = mockRes();

      const result = await service.refreshToken(reqWith('tok'), res);

      expect(bcrypt.compare).toHaveBeenCalledWith('tok', 'hashed-refresh');
      expect(tokenService.generateAccessToken).toHaveBeenCalledWith({
        id: 'user-1',
        role: UserRole.FREELANCER,
      });
      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'access-token',
        expect.any(Object),
      );
      expect(result).toEqual({
        data: null,
        message: 'Access token refreshed successfully.',
      });
    });
  });
});
