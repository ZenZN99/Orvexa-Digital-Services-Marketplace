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
import { UserService } from '../user.service.js';
import { User } from '../schema/user.schema.js';
import { UserProfile } from '../../profiles/user-profiles/schema/user-profile.schema.js';
import { UserVerification } from '../../user-verifications/schema/user-verification.schema.js';
import { NotificationService } from '../../notifications/notification.service.js';
import { messages } from '../../../common/libs/messages.js';
import { UserRole } from '../../../common/enums/user.enum.js';
import { NotificationType } from '../../../common/enums/notification.enum.js';
import { sanitizeUser } from '../../../common/libs/sanitize-user.js';

vi.mock('../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

vi.mock('../../../common/libs/sanitize-user.js', () => ({
  sanitizeUser: vi.fn(),
}));

describe('UserService', () => {
  let service: UserService;

  const userModel = {
    findAndCountAll: vi.fn(),
    findOne: vi.fn(),
    findByPk: vi.fn(),
  };
  const userProfileModel = { findAll: vi.fn(), findOne: vi.fn() };
  const userVerificationModel = { findAll: vi.fn(), findOne: vi.fn() };
  const notificationService = { create: vi.fn() };

  /** Mimics a Sequelize instance that exposes get({ plain: true }). */
  const plain = <T extends object>(data: T) => ({
    ...data,
    get: vi.fn().mockReturnValue(data),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User), useValue: userModel },
        { provide: getModelToken(UserProfile), useValue: userProfileModel },
        {
          provide: getModelToken(UserVerification),
          useValue: userVerificationModel,
        },
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compile();

    service = module.get(UserService);
    (sanitizeUser as Mock).mockImplementation((u) => ({ id: u.id }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('should attach profile and verification to each user and paginate', async () => {
      const users = [{ id: 'u1' }, { id: 'u2' }];
      const profile = { id: 'p1', userId: 'u1', bio: 'hi' };
      const verification = { id: 'v1', userId: 'u2', status: 'approved' };
      userModel.findAndCountAll.mockResolvedValue({ rows: users, count: 25 });
      userProfileModel.findAll.mockResolvedValue([plain(profile)]);
      userVerificationModel.findAll.mockResolvedValue([plain(verification)]);

      const result = await service.findAll(2, 10);

      expect(userModel.findAndCountAll).toHaveBeenCalledWith({
        offset: 10,
        limit: 10,
        order: [['createdAt', 'DESC']],
      });
      expect(userProfileModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: ['u1', 'u2'] } }),
      );
      expect(userVerificationModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: ['u1', 'u2'] } }),
      );
      expect(result).toEqual({
        data: {
          users: [
            {
              id: 'u1',
              profile: expect.objectContaining(profile),
              verification: null,
            },
            {
              id: 'u2',
              profile: null,
              verification: expect.objectContaining(verification),
            },
          ],
          pagination: {
            page: 2,
            limit: 10,
            total: 25,
            totalPages: 3,
            hasNextPage: true,
            hasPreviousPage: true,
          },
        },
        message: null,
      });
    });

    it('should use default page=1 and limit=10 and handle an empty list', async () => {
      userModel.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });
      userProfileModel.findAll.mockResolvedValue([]);
      userVerificationModel.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(userModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ offset: 0, limit: 10 }),
      );
      expect(result).toEqual({
        data: {
          users: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
        message: null,
      });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('should throw NotFoundException if user not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(service.findOne('u1')).rejects.toThrow(
        new NotFoundException(messages.user.notFound),
      );
    });

    it('should return the sanitized user with profile and verification', async () => {
      const profile = { id: 'p1', bio: 'hi' };
      const verification = { status: 'approved' };
      userModel.findOne.mockResolvedValue({ id: 'u1' });
      userProfileModel.findOne.mockResolvedValue(plain(profile));
      userVerificationModel.findOne.mockResolvedValue(plain(verification));

      const result = await service.findOne('u1');

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { id: 'u1' } });
      expect(userVerificationModel.findOne).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        attributes: ['status'],
      });
      expect(result).toEqual({
        data: {
          id: 'u1',
          profile: expect.objectContaining(profile),
          verification: expect.objectContaining(verification),
        },
        message: null,
      });
    });

    it('should return null profile and verification when they do not exist', async () => {
      userModel.findOne.mockResolvedValue({ id: 'u1' });
      userProfileModel.findOne.mockResolvedValue(null);
      userVerificationModel.findOne.mockResolvedValue(null);

      const result = await service.findOne('u1');

      expect(result).toEqual({
        data: { id: 'u1', profile: null, verification: null },
        message: null,
      });
    });
  });

  // ───────────────────────── udpateRole ─────────────────────────
  describe('udpateRole', () => {
    it('should throw BadRequestException for a role that is not allowed (ADMIN)', async () => {
      await expect(service.udpateRole('u1', UserRole.ADMIN)).rejects.toThrow(
        new BadRequestException(messages.user.updateRole.invalidRole),
      );
      expect(userModel.findByPk).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.udpateRole('u1', UserRole.SUPPORT)).rejects.toThrow(
        new NotFoundException(messages.user.notFound),
      );
    });

    it.each([UserRole.CLIENT, UserRole.FREELANCER, UserRole.SUPPORT])(
      'should update the role to %s and save',
      async (role) => {
        const user = {
          id: 'u1',
          role: 'old' as unknown,
          save: vi.fn().mockResolvedValue(undefined),
        };
        userModel.findByPk.mockResolvedValue(user);

        const result = await service.udpateRole('u1', role);

        expect(user.role).toBe(role);
        expect(user.save).toHaveBeenCalled();
        expect(result).toEqual({
          data: user,
          message: messages.user.updateRole.success,
        });
      },
    );
  });

  // ───────────────────────── block ─────────────────────────
  describe('block', () => {
    it('should throw NotFoundException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.block('admin-1', 'u1')).rejects.toThrow(
        new NotFoundException(messages.user.notFound),
      );
      expect(notificationService.create).not.toHaveBeenCalled();
    });

    it('should deactivate the user, save and notify them', async () => {
      const user = {
        id: 'u1',
        isActive: true,
        save: vi.fn().mockResolvedValue(undefined),
      };
      userModel.findByPk.mockResolvedValue(user);

      const result = await service.block('admin-1', 'u1');

      expect(user.isActive).toBe(false);
      expect(user.save).toHaveBeenCalled();
      expect(notificationService.create).toHaveBeenCalledWith({
        senderId: 'admin-1',
        receiverId: 'u1',
        targetId: 'u1',
        type: NotificationType.BLOCK_USER,
        message: 'Your account has been blocked.',
        link: null,
      });
      expect(result).toEqual({
        data: user,
        message: messages.user.block.success,
      });
    });
  });
});
