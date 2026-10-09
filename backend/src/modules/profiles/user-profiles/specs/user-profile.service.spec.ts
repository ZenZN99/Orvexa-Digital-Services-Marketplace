import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { UserProfileService } from '../user-profile.service.js';
import { UserProfile } from '../schema/user-profile.schema.js';
import { CloudinaryService } from '../../../../infrastructure/cloudinary/cloudinary.service.js';
import { messages } from '../../../../common/libs/messages.js';

vi.mock('../../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('UserProfileService', () => {
  let service: UserProfileService;

  const userProfileModel = { findOne: vi.fn() };
  const cloudinaryService = { upload: vi.fn(), destroy: vi.fn() };

  const makeFile = (name: string) =>
    ({ originalname: name }) as Express.Multer.File;

  const makeProfile = (overrides: Record<string, unknown> = {}) => ({
    userId: 'user-1',
    avatar: { url: 'old-avatar', publicId: 'old-avatar-id' },
    cover: { url: 'old-cover', publicId: 'old-cover-id' },
    bio: 'old bio',
    save: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileService,
        { provide: getModelToken(UserProfile), useValue: userProfileModel },
        { provide: CloudinaryService, useValue: cloudinaryService },
      ],
    }).compile();

    service = module.get(UserProfileService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('update', () => {
    it('should throw NotFoundException if profile not found', async () => {
      userProfileModel.findOne.mockResolvedValue(null);

      await expect(
        service.update('user-1', { bio: 'x' } as any),
      ).rejects.toThrow(new NotFoundException(messages.userProfile.notFound));
      expect(userProfileModel.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(cloudinaryService.upload).not.toHaveBeenCalled();
    });

    it('should update only the bio when no files are sent', async () => {
      const profile = makeProfile();
      userProfileModel.findOne.mockResolvedValue(profile);

      const result = await service.update('user-1', { bio: 'new bio' } as any);

      expect(profile.bio).toBe('new bio');
      expect(profile.avatar).toEqual({
        url: 'old-avatar',
        publicId: 'old-avatar-id',
      });
      expect(cloudinaryService.upload).not.toHaveBeenCalled();
      expect(cloudinaryService.destroy).not.toHaveBeenCalled();
      expect(profile.save).toHaveBeenCalled();
      expect(result).toEqual({
        data: profile,
        message: messages.userProfile.update.success,
      });
    });

    it('should keep the existing bio when bio is undefined', async () => {
      const profile = makeProfile();
      userProfileModel.findOne.mockResolvedValue(profile);

      await service.update('user-1', {} as any);

      expect(profile.bio).toBe('old bio');
      expect(profile.save).toHaveBeenCalled();
    });

    it('should allow clearing the bio with an empty string', async () => {
      const profile = makeProfile();
      userProfileModel.findOne.mockResolvedValue(profile);

      await service.update('user-1', { bio: '' } as any);

      expect(profile.bio).toBe('');
    });

    it('should upload the new avatar first, then destroy the old one', async () => {
      const profile = makeProfile();
      const callOrder: string[] = [];
      const uploaded = { url: 'new-avatar', publicId: 'new-avatar-id' };
      userProfileModel.findOne.mockResolvedValue(profile);
      cloudinaryService.upload.mockImplementation(async () => {
        callOrder.push('upload');
        return uploaded;
      });
      cloudinaryService.destroy.mockImplementation(async () => {
        callOrder.push('destroy');
      });
      const avatar = makeFile('avatar.png');

      await service.update('user-1', {} as any, avatar);

      expect(cloudinaryService.upload).toHaveBeenCalledWith(
        avatar,
        'user-profiles/avatars',
      );
      expect(cloudinaryService.destroy).toHaveBeenCalledWith('old-avatar-id');
      expect(callOrder).toEqual(['upload', 'destroy']);
      expect(profile.avatar).toBe(uploaded);
    });

    it('should upload the new cover and destroy the old one', async () => {
      const profile = makeProfile();
      const uploaded = { url: 'new-cover', publicId: 'new-cover-id' };
      userProfileModel.findOne.mockResolvedValue(profile);
      cloudinaryService.upload.mockResolvedValue(uploaded);
      const cover = makeFile('cover.png');

      await service.update('user-1', {} as any, undefined, cover);

      expect(cloudinaryService.upload).toHaveBeenCalledWith(
        cover,
        'user-profiles/covers',
      );
      expect(cloudinaryService.destroy).toHaveBeenCalledWith('old-cover-id');
      expect(profile.cover).toBe(uploaded);
    });

    it('should not destroy anything when the old image has no publicId (default image)', async () => {
      const profile = makeProfile({
        avatar: { url: 'default-avatar', publicId: '' },
        cover: { url: 'default-cover', publicId: '' },
      });
      userProfileModel.findOne.mockResolvedValue(profile);
      cloudinaryService.upload.mockResolvedValue({
        url: 'n',
        publicId: 'n-id',
      });

      await service.update(
        'user-1',
        {} as any,
        makeFile('a.png'),
        makeFile('c.png'),
      );

      expect(cloudinaryService.upload).toHaveBeenCalledTimes(2);
      expect(cloudinaryService.destroy).not.toHaveBeenCalled();
    });

    it('should update avatar, cover and bio together', async () => {
      const profile = makeProfile();
      userProfileModel.findOne.mockResolvedValue(profile);
      cloudinaryService.upload
        .mockResolvedValueOnce({ url: 'na', publicId: 'na-id' })
        .mockResolvedValueOnce({ url: 'nc', publicId: 'nc-id' });

      await service.update(
        'user-1',
        { bio: 'fresh' } as any,
        makeFile('a.png'),
        makeFile('c.png'),
      );

      expect(profile.avatar).toEqual({ url: 'na', publicId: 'na-id' });
      expect(profile.cover).toEqual({ url: 'nc', publicId: 'nc-id' });
      expect(profile.bio).toBe('fresh');
      expect(cloudinaryService.destroy).toHaveBeenCalledTimes(2);
      expect(profile.save).toHaveBeenCalledTimes(1);
    });
  });
});
