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
import { ReviewService } from '../review.service.js';
import { Review } from '../schema/review.schema.js';
import { Contract } from '../../contracts/schema/contract.schema.js';
import { Payment } from '../../payments/schema/payment.schema.js';
import { Service } from '../../services/schema/service.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';
import { NotificationService } from '../../notifications/notification.service.js';
import { RedisHelper } from '../../../infrastructure/database/redis/redis.helper.js';
import { messages } from '../../../common/libs/messages.js';
import { ContractStatus } from '../../../common/enums/contract.enum.js';
import { PaymentStatus } from '../../../common/enums/payment.enum.js';
import { NotificationType } from '../../../common/enums/notification.enum.js';

vi.mock('../../../common/libs/response.js', () => ({
  response: vi.fn((data, message) => ({ data, message })),
}));

describe('ReviewService', () => {
  let service: ReviewService;

  const reviewModel = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    findByPk: vi.fn(),
    findAndCountAll: vi.fn(),
  };
  const contractModel = { findOne: vi.fn() };
  const userModel = { findByPk: vi.fn() };
  const paymentModel = { findOne: vi.fn() };
  const serviceModel = { update: vi.fn() };
  const freelancerModel = {
    findOne: vi.fn(),
    findByPk: vi.fn(),
    update: vi.fn(),
  };
  const notificationService = { create: vi.fn() };
  const redis = { getJSON: vi.fn(), set: vi.fn() };
  const sequelize = { transaction: vi.fn() };

  let transaction: {
    commit: Mock;
    rollback: Mock;
    LOCK: { UPDATE: string };
  };

  const FIVE_MIN = 5 * 60;
  const clientId = 'client-1';
  const contractId = 'contract-1';

  const makeContract = (overrides: Record<string, unknown> = {}) => ({
    id: contractId,
    orderId: 'order-1',
    serviceId: 'service-1',
    freelancerId: 'freelancer-1',
    status: ContractStatus.COMPLETED,
    ...overrides,
  });

  /** Makes every mock return what create() needs to succeed. */
  const setupCreateHappyPath = () => {
    const review = { id: 'review-1', serviceId: 'service-1' };
    contractModel.findOne.mockResolvedValue(makeContract());
    userModel.findByPk.mockResolvedValue({
      id: clientId,
      firstName: 'Ali',
      lastName: 'Ahmad',
    });
    reviewModel.findOne.mockResolvedValue(null);
    paymentModel.findOne.mockResolvedValue({ id: 'payment-1' });
    reviewModel.create.mockResolvedValue(review);
    reviewModel.findAll
      .mockResolvedValueOnce([{ rating: 5 }, { rating: 4 }]) // service reviews
      .mockResolvedValueOnce([{ rating: 5 }, { rating: 4 }, { rating: 4 }]); // freelancer reviews
    freelancerModel.findByPk.mockResolvedValue({
      id: 'freelancer-1',
      userId: 'freelancer-user-1',
    });
    return { review };
  };

  beforeEach(async () => {
    // reset only our mocks (not the mocked `response` helper) so that
    // leftover mockResolvedValueOnce queues never leak between tests
    [
      reviewModel,
      contractModel,
      userModel,
      paymentModel,
      serviceModel,
      freelancerModel,
      notificationService,
      redis,
    ].forEach((m) => Object.values(m).forEach((fn) => fn.mockReset()));

    transaction = {
      commit: vi.fn().mockResolvedValue(undefined),
      rollback: vi.fn().mockResolvedValue(undefined),
      LOCK: { UPDATE: 'UPDATE' },
    };
    sequelize.transaction.mockResolvedValue(transaction);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: getModelToken(Review), useValue: reviewModel },
        { provide: getModelToken(Contract), useValue: contractModel },
        { provide: getModelToken(User), useValue: userModel },
        { provide: getModelToken(Payment), useValue: paymentModel },
        { provide: getModelToken(Service), useValue: serviceModel },
        { provide: getModelToken(Freelancer), useValue: freelancerModel },
        { provide: NotificationService, useValue: notificationService },
        { provide: RedisHelper, useValue: redis },
        { provide: Sequelize, useValue: sequelize },
      ],
    }).compile();

    service = module.get(ReviewService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────── create ─────────────────────────
  describe('create', () => {
    const dto = { rating: 5, comment: 'Great work' } as any;

    it('should rollback and throw NotFoundException if contract not found', async () => {
      contractModel.findOne.mockResolvedValue(null);

      await expect(service.create(clientId, contractId, dto)).rejects.toThrow(
        new NotFoundException(messages.contract.notFound),
      );
      expect(contractModel.findOne).toHaveBeenCalledWith({
        where: { id: contractId, clientId },
        transaction,
        lock: 'UPDATE',
      });
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw NotFoundException if client not found', async () => {
      contractModel.findOne.mockResolvedValue(makeContract());
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.create(clientId, contractId, dto)).rejects.toThrow(
        new NotFoundException(messages.user.notFound),
      );
      expect(transaction.rollback).toHaveBeenCalled();
    });

    it('should throw BadRequestException if contract is not COMPLETED', async () => {
      contractModel.findOne.mockResolvedValue(
        makeContract({ status: ContractStatus.IN_PROGRESS }),
      );
      userModel.findByPk.mockResolvedValue({ id: clientId });

      await expect(service.create(clientId, contractId, dto)).rejects.toThrow(
        new BadRequestException(messages.review.create.contractNotCompleted),
      );
      expect(reviewModel.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if the contract was already reviewed', async () => {
      contractModel.findOne.mockResolvedValue(makeContract());
      userModel.findByPk.mockResolvedValue({ id: clientId });
      reviewModel.findOne.mockResolvedValue({ id: 'existing-review' });

      await expect(service.create(clientId, contractId, dto)).rejects.toThrow(
        new BadRequestException(messages.review.create.alreadyReviewed),
      );
      expect(reviewModel.findOne).toHaveBeenCalledWith({
        where: { contractId },
        transaction,
        lock: 'UPDATE',
      });
    });

    it('should throw BadRequestException if there is no completed payment', async () => {
      contractModel.findOne.mockResolvedValue(makeContract());
      userModel.findByPk.mockResolvedValue({ id: clientId });
      reviewModel.findOne.mockResolvedValue(null);
      paymentModel.findOne.mockResolvedValue(null);

      await expect(service.create(clientId, contractId, dto)).rejects.toThrow(
        new BadRequestException(messages.review.create.paymentNotCompleted),
      );
      expect(paymentModel.findOne).toHaveBeenCalledWith({
        where: {
          orderId: 'order-1',
          userId: clientId,
          status: PaymentStatus.COMPLETED,
        },
        transaction,
      });
      expect(reviewModel.create).not.toHaveBeenCalled();
    });

    it('should rollback if the freelancer is not found', async () => {
      setupCreateHappyPath();
      freelancerModel.findByPk.mockResolvedValue(null);

      await expect(service.create(clientId, contractId, dto)).rejects.toThrow(
        new NotFoundException(messages.freelancer.notFound),
      );
      expect(transaction.rollback).toHaveBeenCalled();
      expect(transaction.commit).not.toHaveBeenCalled();
    });

    it('should create the review, recalculate ratings, commit and notify the freelancer', async () => {
      const { review } = setupCreateHappyPath();

      const result = await service.create(clientId, contractId, dto);

      expect(reviewModel.create).toHaveBeenCalledWith(
        {
          serviceId: 'service-1',
          clientId,
          contractId,
          freelancerId: 'freelancer-1',
          rating: 5,
          comment: 'Great work',
        },
        { transaction },
      );

      // service: (5 + 4) / 2 = 4.5
      expect(serviceModel.update).toHaveBeenCalledWith(
        { ratingCount: 2, ratingAverage: 4.5 },
        { where: { id: 'service-1' }, transaction },
      );

      // freelancer: (5 + 4 + 4) / 3 = 4.33
      expect(freelancerModel.update).toHaveBeenCalledWith(
        { ratingCount: 3, ratingAverage: 4.33 },
        { where: { id: 'freelancer-1' }, transaction },
      );

      expect(transaction.commit).toHaveBeenCalled();
      expect(transaction.rollback).not.toHaveBeenCalled();

      expect(notificationService.create).toHaveBeenCalledWith({
        senderId: clientId,
        receiverId: 'freelancer-user-1',
        targetId: 'review-1',
        type: NotificationType.REVIEW_CREATED,
        message: 'A client Ali Ahmad has reviewed your service.',
        link: '/service/service-1',
      });
      expect(result).toEqual({
        data: review,
        message: messages.review.create.success,
      });
    });

    it('should store comment as null when no comment is provided', async () => {
      setupCreateHappyPath();

      await service.create(clientId, contractId, { rating: 4 } as any);

      expect(reviewModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ rating: 4, comment: null }),
        { transaction },
      );
    });
  });

  // ─────────── findMe / findByFreelancer (same behaviour) ───────────
  describe.each(['findMe', 'findByFreelancer'] as const)('%s', (method) => {
    const cacheKey = 'reviews:freelancer:freelancer-1:1:10';

    it('should throw NotFoundException if freelancer not found', async () => {
      freelancerModel.findOne.mockResolvedValue(null);

      await expect(service[method]('user-1')).rejects.toThrow(
        new NotFoundException(messages.freelancer.notFound),
      );
      expect(freelancerModel.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        attributes: ['id'],
      });
    });

    it('should return cached reviews when they exist', async () => {
      const cached = { reviews: [], pagination: {} };
      freelancerModel.findOne.mockResolvedValue({ id: 'freelancer-1' });
      redis.getJSON.mockResolvedValue(cached);

      const result = await service[method]('user-1');

      expect(redis.getJSON).toHaveBeenCalledWith(cacheKey);
      expect(reviewModel.findAndCountAll).not.toHaveBeenCalled();
      expect(result).toEqual({ data: cached, message: null });
    });

    it('should query DB with pagination and cache the result on cache miss', async () => {
      const rows = [{ id: 'r1' }];
      freelancerModel.findOne.mockResolvedValue({ id: 'freelancer-1' });
      redis.getJSON.mockResolvedValue(null);
      reviewModel.findAndCountAll.mockResolvedValue({ rows, count: 25 });

      const result = await service[method]('user-1', 2, 10);

      expect(reviewModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 10,
          order: [['createdAt', 'DESC']],
        }),
      );
      const expected = {
        reviews: rows,
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
        'reviews:freelancer:freelancer-1:2:10',
        expected,
        FIVE_MIN,
      );
      expect(result).toEqual({ data: expected, message: null });
    });
  });

  // ───────────────────────── findAllByService ─────────────────────────
  describe('findAllByService', () => {
    it('should return cached reviews when they exist', async () => {
      const cached = { reviews: [] };
      redis.getJSON.mockResolvedValue(cached);

      const result = await service.findAllByService('service-1', 1, 10);

      expect(redis.getJSON).toHaveBeenCalledWith(
        'reviews:service:service-1:1:10',
      );
      expect(reviewModel.findAndCountAll).not.toHaveBeenCalled();
      expect(result).toEqual({ data: cached, message: null });
    });

    it('should query DB and cache the page on cache miss', async () => {
      const rows = [{ id: 'r1' }];
      redis.getJSON.mockResolvedValue(null);
      reviewModel.findAndCountAll.mockResolvedValue({ rows, count: 1 });

      const result = await service.findAllByService('service-1');

      expect(reviewModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { serviceId: 'service-1' },
          limit: 10,
          offset: 0,
        }),
      );
      const expected = {
        reviews: rows,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
      expect(redis.set).toHaveBeenCalledWith(
        'reviews:service:service-1:1:10',
        expected,
        FIVE_MIN,
      );
      expect(result).toEqual({ data: expected, message: null });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe('findOne', () => {
    it('should return the cached review when it exists', async () => {
      const cached = { id: 'review-1' };
      redis.getJSON.mockResolvedValue(cached);

      const result = await service.findOne('review-1');

      expect(redis.getJSON).toHaveBeenCalledWith('review:review-1');
      expect(reviewModel.findByPk).not.toHaveBeenCalled();
      expect(result).toEqual({ data: cached, message: null });
    });

    it('should throw NotFoundException if review not found', async () => {
      redis.getJSON.mockResolvedValue(null);
      reviewModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne('review-1')).rejects.toThrow(
        new NotFoundException(messages.review.notFound),
      );
      expect(redis.set).not.toHaveBeenCalled();
    });

    it('should return the review and cache it', async () => {
      const review = { id: 'review-1' };
      redis.getJSON.mockResolvedValue(null);
      reviewModel.findByPk.mockResolvedValue(review);

      const result = await service.findOne('review-1');

      expect(redis.set).toHaveBeenCalledWith(
        'review:review-1',
        review,
        FIVE_MIN,
      );
      expect(result).toEqual({ data: review, message: null });
    });
  });
});
