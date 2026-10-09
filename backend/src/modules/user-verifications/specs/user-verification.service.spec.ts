import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserVerificationService } from '../user-verification.service.js';
import { UserVerification } from '../schema/user-verification.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { CloudinaryService } from '../../../infrastructure/cloudinary/cloudinary.service.js';
import { NotificationService } from '../../notifications/notification.service.js';
import { messages } from '../../../common/libs/messages.js';
import { UserVerificationStatus } from '../../../common/enums/user-verification.enum.js';
import { UserRole } from '../../../common/enums/user.enum.js';
import { NotificationType } from '../../../common/enums/notification.enum.js';

vi.mock('../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('UserVerificationService', () => {
  let service: UserVerificationService;

  const userVerificationModel = {
    findOne: vi.fn(),
    findByPk: vi.fn(),
    create: vi.fn(),
    findAndCountAll: vi.fn(),
  };
  const userModel = { findByPk: vi.fn(), findAll: vi.fn() };
  const cloudinaryService = { upload: vi.fn(), destroy: vi.fn() };
  const notificationService = { create: vi.fn() };

  const userId = 'user-1';
  const profileImage = { originalname: 'face.png' } as Express.Multer.File;
  const identityDocument = { originalname: 'id.png' } as Express.Multer.File;

  const makeVerification = (overrides: Record<string, unknown> = {}) => ({
    id: 'v1',
    userId,
    status: UserVerificationStatus.REJECTED as UserVerificationStatus | null,
    profileImage: { url: 'old-p', publicId: 'old-profile-id' } as unknown,
    identityDocument: { url: 'old-i', publicId: 'old-identity-id' } as unknown,
    rejectionReason: 'blurry' as string | null,
    reviewedBy: 'admin-0' as string | null,
    reviewedAt: new Date() as Date | null,
    submittedAt: new Date() as Date | null,
    save: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });

  const mockUploads = () => {
    cloudinaryService.upload
      .mockResolvedValueOnce({
        url: 'new-profile-url',
        publicId: 'new-profile-id',
      })
      .mockResolvedValueOnce({
        url: 'new-identity-url',
        publicId: 'new-identity-id',
      });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserVerificationService,
        {
          provide: getModelToken(UserVerification),
          useValue: userVerificationModel,
        },
        { provide: getModelToken(User), useValue: userModel },
        { provide: CloudinaryService, useValue: cloudinaryService },
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compile();

    service = module.get(UserVerificationService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    it('should throw NotFoundException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(
        service.create(userId, profileImage, identityDocument),
      ).rejects.toThrow(new NotFoundException(messages.user.notFound));
    });

    it('should throw BadRequestException if a verification is already PENDING', async () => {
      userModel.findByPk.mockResolvedValue({ id: userId });
      userVerificationModel.findOne.mockResolvedValue(
        makeVerification({ status: UserVerificationStatus.PENDING }),
      );

      await expect(
        service.create(userId, profileImage, identityDocument),
      ).rejects.toThrow(
        new BadRequestException(messages.userVerification.alreadyPending),
      );
      expect(cloudinaryService.upload).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if the user is already verified', async () => {
      userModel.findByPk.mockResolvedValue({ id: userId });
      userVerificationModel.findOne.mockResolvedValue(
        makeVerification({ status: UserVerificationStatus.APPROVED }),
      );

      await expect(
        service.create(userId, profileImage, identityDocument),
      ).rejects.toThrow(
        new BadRequestException(messages.userVerification.alreadyVerified),
      );
    });

    it('should create a new PENDING verification and notify admins', async () => {
      const verification = { id: 'v-new' };
      userModel.findByPk.mockResolvedValue({ id: userId });
      userVerificationModel.findOne.mockResolvedValue(null);
      mockUploads();
      userVerificationModel.create.mockResolvedValue(verification);
      userModel.findAll.mockResolvedValue([
        { id: 'admin-1' },
        { id: 'admin-2' },
      ]);

      const result = await service.create(
        userId,
        profileImage,
        identityDocument,
      );

      expect(cloudinaryService.upload).toHaveBeenNthCalledWith(
        1,
        profileImage,
        'verifications/profile',
      );
      expect(cloudinaryService.upload).toHaveBeenNthCalledWith(
        2,
        identityDocument,
        'verifications/identity',
      );
      expect(cloudinaryService.destroy).not.toHaveBeenCalled();
      expect(userVerificationModel.create).toHaveBeenCalledWith({
        userId,
        profileImage: { url: 'new-profile-url', publicId: 'new-profile-id' },
        identityDocument: {
          url: 'new-identity-url',
          publicId: 'new-identity-id',
        },
        status: UserVerificationStatus.PENDING,
        submittedAt: expect.any(Date),
      });
      expect(userModel.findAll).toHaveBeenCalledWith({
        where: { role: UserRole.ADMIN },
      });
      expect(notificationService.create).toHaveBeenCalledTimes(2);
      expect(notificationService.create).toHaveBeenCalledWith({
        senderId: userId,
        receiverId: 'admin-1',
        targetId: 'v-new',
        type: NotificationType.USER_VERIFICATION,
        message: 'A new identity verification request has been submitted.',
        link: '/admin',
      });
      expect(result).toEqual({
        data: verification,
        message: messages.userVerification.create.success,
      });
    });

    it('should resubmit a REJECTED verification: delete old images, upload new ones and reset review data', async () => {
      const existing = makeVerification();
      userModel.findByPk.mockResolvedValue({ id: userId });
      userVerificationModel.findOne.mockResolvedValue(existing);
      mockUploads();
      userModel.findAll.mockResolvedValue([{ id: 'admin-1' }]);

      const result = await service.create(
        userId,
        profileImage,
        identityDocument,
      );

      expect(cloudinaryService.destroy).toHaveBeenCalledWith('old-profile-id');
      expect(cloudinaryService.destroy).toHaveBeenCalledWith('old-identity-id');
      expect(existing.profileImage).toEqual({
        url: 'new-profile-url',
        publicId: 'new-profile-id',
      });
      expect(existing.identityDocument).toEqual({
        url: 'new-identity-url',
        publicId: 'new-identity-id',
      });
      expect(existing.status).toBe(UserVerificationStatus.PENDING);
      expect(existing.rejectionReason).toBeNull();
      expect(existing.reviewedBy).toBeNull();
      expect(existing.reviewedAt).toBeNull();
      expect(existing.submittedAt).toBeInstanceOf(Date);
      expect(existing.save).toHaveBeenCalled();
      expect(userVerificationModel.create).not.toHaveBeenCalled();
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          targetId: 'v1',
          message: 'A user has resubmitted an identity verification request.',
        }),
      );
      expect(result).toEqual({
        data: existing,
        message: messages.userVerification.resubmit.success,
      });
    });

    it('should not call cloudinary.destroy for old images without a publicId', async () => {
      const existing = makeVerification({
        profileImage: null,
        identityDocument: { url: 'x', publicId: '' },
      });
      userModel.findByPk.mockResolvedValue({ id: userId });
      userVerificationModel.findOne.mockResolvedValue(existing);
      mockUploads();
      userModel.findAll.mockResolvedValue([]);

      await service.create(userId, profileImage, identityDocument);

      expect(cloudinaryService.destroy).not.toHaveBeenCalled();
      expect(notificationService.create).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────── findPending ─────────────────────────
  describe('findPending', () => {
    it('should return pending verifications ordered by submittedAt ASC with pagination', async () => {
      const rows = [{ id: 'v1' }];
      userVerificationModel.findAndCountAll.mockResolvedValue({
        rows,
        count: 12,
      });

      const result = await service.findPending(2, 10);

      expect(userVerificationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: UserVerificationStatus.PENDING },
          order: [['submittedAt', 'ASC']],
          offset: 10,
          limit: 10,
        }),
      );
      expect(result).toEqual({
        data: {
          verifications: rows,
          pagination: {
            page: 2,
            limit: 10,
            total: 12,
            totalPages: 2,
            hasNextPage: false,
            hasPreviousPage: true,
          },
        },
        message: null,
      });
    });
  });

  // ───────────────────────── tryAgain ─────────────────────────
  describe('tryAgain', () => {
    it('should throw NotFoundException if verification not found', async () => {
      userVerificationModel.findOne.mockResolvedValue(null);

      await expect(service.tryAgain(userId)).rejects.toThrow(
        new NotFoundException(messages.userVerification.notFound),
      );
    });

    it('should throw BadRequestException if verification is PENDING', async () => {
      userVerificationModel.findOne.mockResolvedValue(
        makeVerification({ status: UserVerificationStatus.PENDING }),
      );

      await expect(service.tryAgain(userId)).rejects.toThrow(
        new BadRequestException(messages.userVerification.alreadyPending),
      );
    });

    it('should throw BadRequestException if verification is APPROVED', async () => {
      userVerificationModel.findOne.mockResolvedValue(
        makeVerification({ status: UserVerificationStatus.APPROVED }),
      );

      await expect(service.tryAgain(userId)).rejects.toThrow(
        new BadRequestException(messages.userVerification.alreadyVerified),
      );
    });

    it('should delete images and reset every field of a REJECTED verification', async () => {
      const verification = makeVerification();
      userVerificationModel.findOne.mockResolvedValue(verification);

      const result = await service.tryAgain(userId);

      expect(cloudinaryService.destroy).toHaveBeenCalledWith('old-profile-id');
      expect(cloudinaryService.destroy).toHaveBeenCalledWith('old-identity-id');
      expect(verification.profileImage).toBeNull();
      expect(verification.identityDocument).toBeNull();
      expect(verification.status).toBeNull();
      expect(verification.rejectionReason).toBeNull();
      expect(verification.reviewedBy).toBeNull();
      expect(verification.reviewedAt).toBeNull();
      expect(verification.submittedAt).toBeNull();
      expect(verification.save).toHaveBeenCalled();
      expect(result).toEqual({ data: verification, message: null });
    });
  });

  // ───────────────────────── updateStatus ─────────────────────────
  describe('updateStatus', () => {
    const pending = () =>
      makeVerification({
        status: UserVerificationStatus.PENDING,
        rejectionReason: null,
        reviewedBy: null,
        reviewedAt: null,
      });

    it('should throw NotFoundException if verification not found', async () => {
      userVerificationModel.findByPk.mockResolvedValue(null);

      await expect(
        service.updateStatus('admin-1', 'v1', {
          status: UserVerificationStatus.APPROVED,
        } as any),
      ).rejects.toThrow(
        new NotFoundException(messages.userVerification.notFound),
      );
    });

    it('should throw BadRequestException if verification was already reviewed', async () => {
      userVerificationModel.findByPk.mockResolvedValue(
        makeVerification({ status: UserVerificationStatus.APPROVED }),
      );

      await expect(
        service.updateStatus('admin-1', 'v1', {
          status: UserVerificationStatus.REJECTED,
          rejectionReason: 'x',
        } as any),
      ).rejects.toThrow(
        new BadRequestException(messages.userVerification.alreadyReviewed),
      );
    });

    it.each([[undefined], ['   ']])(
      'should require a rejection reason when rejecting (reason: %p)',
      async (rejectionReason) => {
        userVerificationModel.findByPk.mockResolvedValue(pending());

        await expect(
          service.updateStatus('admin-1', 'v1', {
            status: UserVerificationStatus.REJECTED,
            rejectionReason,
          } as any),
        ).rejects.toThrow(
          new BadRequestException(
            messages.userVerification.rejectionReasonRequired,
          ),
        );
        expect(notificationService.create).not.toHaveBeenCalled();
      },
    );

    it('should approve, store review data and notify the user', async () => {
      const verification = pending();
      userVerificationModel.findByPk.mockResolvedValue(verification);

      const result = await service.updateStatus('admin-1', 'v1', {
        status: UserVerificationStatus.APPROVED,
      } as any);

      expect(verification.status).toBe(UserVerificationStatus.APPROVED);
      expect(verification.rejectionReason).toBe(
        'Congratulations! Your identity has been verified successfully.',
      );
      expect(verification.reviewedBy).toBe('admin-1');
      expect(verification.reviewedAt).toBeInstanceOf(Date);
      expect(verification.save).toHaveBeenCalled();
      expect(notificationService.create).toHaveBeenCalledWith({
        senderId: 'admin-1',
        receiverId: userId,
        targetId: 'v1',
        type: NotificationType.USER_VERIFICATION_APPROVED,
        message: 'Your identity verification has been approved.',
        link: '/identity-verification',
      });
      expect(result).toEqual({
        data: verification,
        message: messages.userVerification.updateStatus.success,
      });
    });

    it('should reject with a trimmed reason and notify the user', async () => {
      const verification = pending();
      userVerificationModel.findByPk.mockResolvedValue(verification);

      await service.updateStatus('admin-1', 'v1', {
        status: UserVerificationStatus.REJECTED,
        rejectionReason: '  Document is blurry  ',
      } as any);

      expect(verification.status).toBe(UserVerificationStatus.REJECTED);
      expect(verification.rejectionReason).toBe('Document is blurry');
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.USER_VERIFICATION_REJECTED,
          message: 'Your identity verification has been rejected.',
        }),
      );
    });
  });
});
