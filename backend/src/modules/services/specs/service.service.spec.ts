import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ServiceService } from '../service.service.js';
import { Service } from '../schema/service.schema.js';
import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { CloudinaryService } from '../../../infrastructure/cloudinary/cloudinary.service.js';
import { NotificationService } from '../../notifications/notification.service.js';
import { RedisHelper } from '../../../infrastructure/database/redis/redis.helper.js';
import { messages } from '../../../common/libs/messages.js';
import { ServiceStatus } from '../../../common/enums/service.enum.js';
import { UserRole } from '../../../common/enums/user.enum.js';
import { NotificationType } from '../../../common/enums/notification.enum.js';

vi.mock('../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('ServiceService', () => {
  let service: ServiceService;

  const serviceModel = {
    count: vi.fn(),
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    findByPk: vi.fn(),
    findAndCountAll: vi.fn(),
  };
  const freelancerModel = { findOne: vi.fn(), findByPk: vi.fn() };
  const userModel = { findAll: vi.fn() };
  const cloudinaryService = { upload: vi.fn(), destroy: vi.fn() };
  const notificationService = { create: vi.fn() };
  const redis = { getJSON: vi.fn(), set: vi.fn() };

  const FIVE_MIN = 5 * 60;
  const freelancer = { id: 'freelancer-1', userId: 'user-1' };

  const makeFile = (name: string) =>
    ({ originalname: name }) as Express.Multer.File;

  const makeService = (overrides: Record<string, unknown> = {}) => ({
    id: 'service-1',
    freelancerId: 'freelancer-1',
    status: ServiceStatus.PUBLISHED,
    reason: null as string | null,
    images: [{ url: 'u-old', publicId: 'p-old' }],
    save: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        { provide: getModelToken(Service), useValue: serviceModel },
        { provide: getModelToken(Freelancer), useValue: freelancerModel },
        { provide: getModelToken(User), useValue: userModel },
        { provide: CloudinaryService, useValue: cloudinaryService },
        { provide: NotificationService, useValue: notificationService },
        { provide: RedisHelper, useValue: redis },
      ],
    }).compile();

    service = module.get(ServiceService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    const dto = {
      category: 'design',
      title: 'Logo',
      description: 'I design logos',
      features: ['f1'],
      keywords: ['k1'],
      price: 50,
      deliveryDays: 3,
    } as any;

    it('should throw NotFoundException if freelancer not found', async () => {
      freelancerModel.findOne.mockResolvedValue(null);

      await expect(
        service.create('user-1', dto, [makeFile('a.png')]),
      ).rejects.toThrow(new NotFoundException(messages.freelancer.notFound));
    });

    it('should throw BadRequestException when the 15 services limit is reached', async () => {
      freelancerModel.findOne.mockResolvedValue(freelancer);
      serviceModel.count.mockResolvedValue(15);

      await expect(
        service.create('user-1', dto, [makeFile('a.png')]),
      ).rejects.toThrow(
        new BadRequestException(messages.service.create.maxServices),
      );
      expect(serviceModel.count).toHaveBeenCalledWith({
        where: { freelancerId: 'freelancer-1' },
      });
    });

    it.each([[[]], [undefined]])(
      'should throw BadRequestException if images are missing (%p)',
      async (images) => {
        freelancerModel.findOne.mockResolvedValue(freelancer);
        serviceModel.count.mockResolvedValue(0);

        await expect(
          service.create('user-1', dto, images as any),
        ).rejects.toThrow(
          new BadRequestException(messages.service.imagesRequired),
        );
        expect(cloudinaryService.upload).not.toHaveBeenCalled();
      },
    );

    it('should upload images, create a PENDING service and notify every admin', async () => {
      const created = { id: 'service-1' };
      freelancerModel.findOne.mockResolvedValue(freelancer);
      serviceModel.count.mockResolvedValue(2);
      cloudinaryService.upload
        .mockResolvedValueOnce({ url: 'u1', publicId: 'p1' })
        .mockResolvedValueOnce({ url: 'u2', publicId: 'p2' });
      serviceModel.create.mockResolvedValue(created);
      userModel.findAll.mockResolvedValue([
        { id: 'admin-1' },
        { id: 'admin-2' },
      ]);
      const images = [makeFile('a.png'), makeFile('b.png')];

      const result = await service.create('user-1', dto, images);

      expect(cloudinaryService.upload).toHaveBeenCalledWith(
        images[0],
        'services',
      );
      expect(cloudinaryService.upload).toHaveBeenCalledWith(
        images[1],
        'services',
      );
      expect(serviceModel.create).toHaveBeenCalledWith({
        freelancerId: 'freelancer-1',
        category: 'design',
        title: 'Logo',
        description: 'I design logos',
        features: ['f1'],
        keywords: ['k1'],
        images: [
          { url: 'u1', publicId: 'p1' },
          { url: 'u2', publicId: 'p2' },
        ],
        price: 50,
        deliveryDays: 3,
        status: ServiceStatus.PENDING,
      });
      expect(userModel.findAll).toHaveBeenCalledWith({
        where: { role: UserRole.ADMIN },
      });
      expect(notificationService.create).toHaveBeenCalledTimes(2);
      expect(notificationService.create).toHaveBeenCalledWith({
        senderId: 'user-1',
        receiverId: 'admin-2',
        targetId: 'service-1',
        type: NotificationType.SERVICE_REVIEW,
        message: 'A new service is waiting for your review.',
        link: '/admin',
      });
      expect(result).toEqual({
        data: created,
        message: messages.service.create.success,
      });
    });

    it('should not notify anyone when there are no admins', async () => {
      freelancerModel.findOne.mockResolvedValue(freelancer);
      serviceModel.count.mockResolvedValue(0);
      cloudinaryService.upload.mockResolvedValue({ url: 'u', publicId: 'p' });
      serviceModel.create.mockResolvedValue({ id: 'service-1' });
      userModel.findAll.mockResolvedValue([]);

      await service.create('user-1', dto, [makeFile('a.png')]);

      expect(notificationService.create).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe('findAll', () => {
    it('should return cached list when it exists', async () => {
      const cached = { services: [] };
      redis.getJSON.mockResolvedValue(cached);

      const result = await service.findAll(1, 10);

      expect(redis.getJSON).toHaveBeenCalledWith('services:list:1:10');
      expect(serviceModel.findAndCountAll).not.toHaveBeenCalled();
      expect(result).toEqual({ data: cached, message: null });
    });

    it('should query only PUBLISHED services, paginate and cache on miss', async () => {
      const rows = [{ id: 's1' }];
      redis.getJSON.mockResolvedValue(null);
      serviceModel.findAndCountAll.mockResolvedValue({ rows, count: 25 });

      const result = await service.findAll(2, 10);

      expect(serviceModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: ServiceStatus.PUBLISHED },
          offset: 10,
          limit: 10,
          order: [['createdAt', 'DESC']],
        }),
      );
      const expected = {
        services: rows,
        pagination: {
          page: 2,
          limit: 10,
          total: 25,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: true,
        },
      };
      expect(redis.set).toHaveBeenCalledWith(
        'services:list:2:10',
        expected,
        FIVE_MIN,
      );
      expect(result).toEqual({ data: expected, message: null });
    });
  });

  // ─────────── findMe / findByFreelancer (same behaviour) ───────────
  describe.each(['findMe', 'findByFreelancer'] as const)('%s', (method) => {
    it('should throw NotFoundException if freelancer not found', async () => {
      freelancerModel.findOne.mockResolvedValue(null);

      await expect(service[method]('user-1')).rejects.toThrow(
        new NotFoundException(messages.freelancer.notFound),
      );
    });

    it("should return the freelancer's services newest first", async () => {
      const list = [{ id: 's1' }];
      freelancerModel.findOne.mockResolvedValue(freelancer);
      serviceModel.findAll.mockResolvedValue(list);

      const result = await service[method]('user-1');

      expect(serviceModel.findAll).toHaveBeenCalledWith({
        where: { freelancerId: 'freelancer-1' },
        order: [['createdAt', 'DESC']],
      });
      expect(result).toEqual({ data: list, message: null });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('should return cached service when it exists', async () => {
      const cached = { id: 'service-1' };
      redis.getJSON.mockResolvedValue(cached);

      const result = await service.findOne('service-1');

      expect(redis.getJSON).toHaveBeenCalledWith('service:service-1');
      expect(serviceModel.findOne).not.toHaveBeenCalled();
      expect(result).toEqual({ data: cached, message: null });
    });

    it('should throw NotFoundException if service is not found / not published', async () => {
      redis.getJSON.mockResolvedValue(null);
      serviceModel.findOne.mockResolvedValue(null);

      await expect(service.findOne('service-1')).rejects.toThrow(
        new NotFoundException(messages.service.notFound),
      );
      expect(serviceModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'service-1', status: ServiceStatus.PUBLISHED },
        }),
      );
    });

    it('should return the service and cache it', async () => {
      const found = { id: 'service-1' };
      redis.getJSON.mockResolvedValue(null);
      serviceModel.findOne.mockResolvedValue(found);

      const result = await service.findOne('service-1');

      expect(redis.set).toHaveBeenCalledWith(
        'service:service-1',
        found,
        FIVE_MIN,
      );
      expect(result).toEqual({ data: found, message: null });
    });
  });

  // ───────────────────────── findPending ─────────────────────────
  describe('findPending', () => {
    it('should return cached pending list when it exists', async () => {
      const cached = { services: [] };
      redis.getJSON.mockResolvedValue(cached);

      const result = await service.findPending();

      expect(redis.getJSON).toHaveBeenCalledWith('services:pending:1:10');
      expect(result).toEqual({ data: cached, message: null });
    });

    it('should query PENDING services and cache them for 60 seconds', async () => {
      const rows = [{ id: 's1' }];
      redis.getJSON.mockResolvedValue(null);
      serviceModel.findAndCountAll.mockResolvedValue({ rows, count: 1 });

      const result = await service.findPending();

      expect(serviceModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: ServiceStatus.PENDING },
          offset: 0,
          limit: 10,
        }),
      );
      expect(redis.set).toHaveBeenCalledWith(
        'services:pending:1:10',
        expect.objectContaining({ services: rows }),
        60,
      );
      expect(result.message).toBeNull();
    });
  });

  // ───────────────────────── update ─────────────────────────
  describe('update', () => {
    it('should throw NotFoundException if freelancer not found', async () => {
      freelancerModel.findOne.mockResolvedValue(null);

      await expect(
        service.update('user-1', 'service-1', {} as any),
      ).rejects.toThrow(new NotFoundException(messages.freelancer.notFound));
    });

    it('should throw NotFoundException if service does not belong to the freelancer', async () => {
      freelancerModel.findOne.mockResolvedValue(freelancer);
      serviceModel.findOne.mockResolvedValue(null);

      await expect(
        service.update('user-1', 'service-1', {} as any),
      ).rejects.toThrow(new NotFoundException(messages.service.notFound));
      expect(serviceModel.findOne).toHaveBeenCalledWith({
        where: { id: 'service-1', freelancerId: 'freelancer-1' },
      });
    });

    it('should throw BadRequestException if an empty images array is sent', async () => {
      freelancerModel.findOne.mockResolvedValue(freelancer);
      serviceModel.findOne.mockResolvedValue(makeService());

      await expect(
        service.update('user-1', 'service-1', {} as any, []),
      ).rejects.toThrow(
        new BadRequestException(messages.service.imagesRequired),
      );
    });

    it('should update only defined fields, reset status to PENDING and notify admins', async () => {
      const existing = makeService({
        status: ServiceStatus.REJECTED,
        reason: 'bad',
      });
      freelancerModel.findOne.mockResolvedValue(freelancer);
      serviceModel.findOne.mockResolvedValue(existing);
      userModel.findAll.mockResolvedValue([{ id: 'admin-1' }]);

      const result = await service.update('user-1', 'service-1', {
        title: 'New title',
        price: undefined,
      } as any);

      expect(existing.update).toHaveBeenCalledWith({ title: 'New title' });
      expect(existing.status).toBe(ServiceStatus.PENDING);
      expect(existing.reason).toBeNull();
      expect(existing.save).toHaveBeenCalled();
      expect(cloudinaryService.upload).not.toHaveBeenCalled();
      expect(cloudinaryService.destroy).not.toHaveBeenCalled();
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          senderId: 'user-1',
          receiverId: 'admin-1',
          targetId: 'service-1',
          type: NotificationType.SERVICE_REVIEW,
          link: '/admin',
        }),
      );
      expect(result).toEqual({
        data: existing,
        message: messages.service.update.success,
      });
    });

    it('should replace images: destroy the old ones and upload the new ones', async () => {
      const existing = makeService({
        images: [
          { url: 'o1', publicId: 'old-1' },
          { url: 'o2', publicId: 'old-2' },
        ],
      });
      freelancerModel.findOne.mockResolvedValue(freelancer);
      serviceModel.findOne.mockResolvedValue(existing);
      cloudinaryService.upload.mockResolvedValue({
        url: 'n1',
        publicId: 'new-1',
      });
      userModel.findAll.mockResolvedValue([]);
      const newImage = makeFile('new.png');

      await service.update('user-1', 'service-1', {} as any, [newImage]);

      expect(cloudinaryService.destroy).toHaveBeenCalledTimes(2);
      expect(cloudinaryService.destroy).toHaveBeenCalledWith('old-1');
      expect(cloudinaryService.destroy).toHaveBeenCalledWith('old-2');
      expect(cloudinaryService.upload).toHaveBeenCalledWith(
        newImage,
        'services',
      );
      expect(existing.images).toEqual([{ url: 'n1', publicId: 'new-1' }]);
    });
  });

  // ───────────────────────── updateStatus ─────────────────────────
  describe('updateStatus', () => {
    it('should throw NotFoundException if service not found', async () => {
      serviceModel.findByPk.mockResolvedValue(null);

      await expect(
        service.updateStatus('service-1', 'admin-1', ServiceStatus.PUBLISHED),
      ).rejects.toThrow(new NotFoundException(messages.service.notFound));
    });

    it('should throw BadRequestException if the status is already the same', async () => {
      serviceModel.findByPk.mockResolvedValue(makeService());

      await expect(
        service.updateStatus('service-1', 'admin-1', ServiceStatus.PUBLISHED),
      ).rejects.toThrow(
        new BadRequestException(
          messages.service.updateStatus.alreadySameStatus,
        ),
      );
    });

    it('should throw BadRequestException when rejecting without a reason', async () => {
      serviceModel.findByPk.mockResolvedValue(
        makeService({ status: ServiceStatus.PENDING }),
      );

      await expect(
        service.updateStatus('service-1', 'admin-1', ServiceStatus.REJECTED),
      ).rejects.toThrow(
        new BadRequestException(messages.service.updateStatus.reasonRequired),
      );
    });

    it('should publish the service, clear the reason and notify the freelancer', async () => {
      const existing = makeService({
        status: ServiceStatus.PENDING,
        reason: 'old reason',
      });
      serviceModel.findByPk.mockResolvedValue(existing);
      freelancerModel.findByPk.mockResolvedValue(freelancer);

      const result = await service.updateStatus(
        'service-1',
        'admin-1',
        ServiceStatus.PUBLISHED,
      );

      expect(existing.status).toBe(ServiceStatus.PUBLISHED);
      expect(existing.reason).toBeNull();
      expect(existing.save).toHaveBeenCalled();
      expect(notificationService.create).toHaveBeenCalledWith({
        senderId: 'admin-1',
        receiverId: 'user-1',
        targetId: 'service-1',
        type: NotificationType.SERVICE_APPROVED,
        message: 'Your service has been approved and published.',
        link: '/services/status',
      });
      expect(result).toEqual({
        data: existing,
        message: messages.service.updateStatus.success,
      });
    });

    it('should reject the service with a reason and notify the freelancer', async () => {
      const existing = makeService({ status: ServiceStatus.PENDING });
      serviceModel.findByPk.mockResolvedValue(existing);
      freelancerModel.findByPk.mockResolvedValue(freelancer);

      await service.updateStatus(
        'service-1',
        'admin-1',
        ServiceStatus.REJECTED,
        'Low quality images',
      );

      expect(existing.status).toBe(ServiceStatus.REJECTED);
      expect(existing.reason).toBe('Low quality images');
      expect(notificationService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.SERVICE_REJECTED,
          message: 'Your service has been rejected. Reason: Low quality images',
        }),
      );
    });

    it('should still succeed without notifying when the freelancer is missing', async () => {
      const existing = makeService({ status: ServiceStatus.PENDING });
      serviceModel.findByPk.mockResolvedValue(existing);
      freelancerModel.findByPk.mockResolvedValue(null);

      const result = await service.updateStatus(
        'service-1',
        'admin-1',
        ServiceStatus.PUBLISHED,
      );

      expect(notificationService.create).not.toHaveBeenCalled();
      expect(result.message).toBe(messages.service.updateStatus.success);
    });
  });

  // ───────────────────────── destroy ─────────────────────────
  describe('destroy', () => {
    const nonAdminRole = Object.values(UserRole).find(
      (r) => r !== UserRole.ADMIN,
    );
    const owner = { id: 'user-1', role: nonAdminRole } as unknown as User;

    it('should throw NotFoundException if service not found', async () => {
      serviceModel.findByPk.mockResolvedValue(null);

      await expect(service.destroy(owner, 'service-1')).rejects.toThrow(
        new NotFoundException(messages.service.notFound),
      );
    });

    it('should throw BadRequestException if service is PENDING', async () => {
      serviceModel.findByPk.mockResolvedValue(
        makeService({ status: ServiceStatus.PENDING }),
      );

      await expect(service.destroy(owner, 'service-1')).rejects.toThrow(
        new BadRequestException(messages.service.destroy.pending),
      );
    });

    it('should throw NotFoundException if the current user has no freelancer profile', async () => {
      serviceModel.findByPk.mockResolvedValue(makeService());
      freelancerModel.findOne.mockResolvedValue(null);

      await expect(service.destroy(owner, 'service-1')).rejects.toThrow(
        new NotFoundException(messages.freelancer.notFound),
      );
    });

    it('should throw ForbiddenException if the user is neither owner nor admin', async () => {
      const existing = makeService({ freelancerId: 'someone-else' });
      serviceModel.findByPk.mockResolvedValue(existing);
      freelancerModel.findOne.mockResolvedValue(freelancer);

      await expect(service.destroy(owner, 'service-1')).rejects.toThrow(
        new ForbiddenException(messages.service.destroy.forbidden),
      );
      expect(existing.destroy).not.toHaveBeenCalled();
    });

    it('should delete images from cloudinary and destroy the service when the owner deletes it', async () => {
      const existing = makeService({
        images: [{ publicId: 'p1' }, { publicId: 'p2' }],
      });
      serviceModel.findByPk.mockResolvedValue(existing);
      freelancerModel.findOne.mockResolvedValue(freelancer);

      const result = await service.destroy(owner, 'service-1');

      expect(freelancerModel.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(cloudinaryService.destroy).toHaveBeenCalledWith('p1');
      expect(cloudinaryService.destroy).toHaveBeenCalledWith('p2');
      expect(existing.destroy).toHaveBeenCalled();
      expect(result).toEqual({
        data: null,
        message: messages.service.destroy.success,
      });
    });

    it('should allow an admin (who has a freelancer profile) to delete a service they do not own', async () => {
      const admin = { id: 'user-1', role: UserRole.ADMIN } as unknown as User;
      const existing = makeService({ freelancerId: 'someone-else' });
      serviceModel.findByPk.mockResolvedValue(existing);
      freelancerModel.findOne.mockResolvedValue(freelancer);

      await service.destroy(admin, 'service-1');

      expect(existing.destroy).toHaveBeenCalled();
    });
  });
});
