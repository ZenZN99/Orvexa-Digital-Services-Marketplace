import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './schema/review.schema.js';
import { Contract } from '../contracts/schema/contract.schema.js';
import { Payment } from '../payments/schema/payment.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { User } from '../users/schema/user.schema.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { ContractStatus } from '../../common/enums/contract.enum.js';
import { PaymentStatus } from '../../common/enums/payment.enum.js';
import { CreateReviewDTO } from './dto/create.js';
import { messages } from '../../common/libs/messages.js';
import { response } from '../../common/libs/response.js';
import { Sequelize } from 'sequelize-typescript';
import { NotificationService } from '../notifications/notification.service.js';
import { NotificationType } from '../../common/enums/notification.enum.js';
import { RedisHelper } from '../../infrastructure/database/redis/redis.helper.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review)
    private readonly reviewModel: typeof Review,

    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,

    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,

    @InjectModel(Service)
    private readonly serviceModel: typeof Service,

    @InjectModel(Freelancer)
    private readonly freelancerModel: typeof Freelancer,

    private readonly notificationService: NotificationService,
    private readonly redis: RedisHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async create(clientId: string, contractId: string, data: CreateReviewDTO) {
    const transaction = await this.sequelize.transaction();

    try {
      // Find the completed contract that belongs to the current client.
      const contract = await this.contractModel.findOne({
        where: {
          id: contractId,
          clientId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!contract) {
        throw new NotFoundException(messages.contract.notFound);
      }

      const client = await this.userModel.findByPk(clientId, {
        attributes: ['id', 'firstName', 'lastName'],
        include: [
          {
            model: UserProfile,
            as: 'profile',
            attributes: ['avatar'],
          },
        ],
        transaction,
      });

      if (!client) {
        throw new NotFoundException(messages.user.notFound);
      }

      // Only completed contracts are allowed to receive a review.
      if (contract.status !== ContractStatus.COMPLETED) {
        throw new BadRequestException(
          messages.review.create.contractNotCompleted,
        );
      }

      // Make sure the client has not already reviewed this contract.
      const existingReview = await this.reviewModel.findOne({
        where: {
          contractId: contract.id,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (existingReview) {
        throw new BadRequestException(messages.review.create.alreadyReviewed);
      }

      // Verify that the order associated with this contract has a successful payment.
      const payment = await this.paymentModel.findOne({
        where: {
          orderId: contract.orderId,
          userId: clientId,
          status: PaymentStatus.COMPLETED,
        },
        transaction,
      });

      if (!payment) {
        throw new BadRequestException(
          messages.review.create.paymentNotCompleted,
        );
      }

      // Create the review using the service and client from the completed contract.
      const review = await this.reviewModel.create(
        {
          serviceId: contract.serviceId,
          clientId,
          contractId: contract.id,
          freelancerId: contract.freelancerId,
          rating: data.rating,
          comment: data.comment ?? null,
        },
        {
          transaction,
        },
      );
      // Recalculate the service rating after creating the new review.
      const serviceReviews = await this.reviewModel.findAll({
        where: {
          serviceId: contract.serviceId,
        },
        attributes: ['rating'],
        transaction,
      });

      const serviceRatingCount = serviceReviews.length;

      const serviceRatingAverage =
        serviceReviews.reduce(
          (total, review) => total + Number(review.rating),
          0,
        ) / serviceRatingCount;

      // Update the service rating statistics.
      await this.serviceModel.update(
        {
          ratingCount: serviceRatingCount,
          ratingAverage: Number(serviceRatingAverage.toFixed(2)),
        },
        {
          where: {
            id: contract.serviceId,
          },
          transaction,
        },
      );

      // Recalculate the freelancer rating from all services belonging to this freelancer.
      const freelancer = await this.freelancerModel.findByPk(
        contract.freelancerId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        },
      );

      if (!freelancer) {
        throw new NotFoundException(messages.freelancer.notFound);
      }

      const freelancerReviews = await this.reviewModel.findAll({
        include: [
          {
            model: Service,
            where: {
              freelancerId: freelancer.id,
            },
          },
        ],
        attributes: ['rating'],
        transaction,
      });

      const freelancerRatingCount = freelancerReviews.length;

      const freelancerRatingAverage =
        freelancerReviews.reduce(
          (total, review) => total + Number(review.rating),
          0,
        ) / freelancerRatingCount;

      // Update the freelancer rating statistics.
      await this.freelancerModel.update(
        {
          ratingCount: freelancerRatingCount,
          ratingAverage: Number(freelancerRatingAverage.toFixed(2)),
        },
        {
          where: {
            id: freelancer.id,
          },
          transaction,
        },
      );

      // Commit the review and all rating updates atomically.
      await transaction.commit();

      await this.notificationService.create({
        senderId: clientId,
        receiverId: freelancer.userId,
        targetId: review.id,
        type: NotificationType.REVIEW_CREATED,
        message: `A client ${client.firstName} ${client.lastName} has reviewed your service.`,
        link: `/service/${review.serviceId}`,
      });

      return response(review, messages.review.create.success);
    } catch (error) {
      // Roll back the entire operation if any step fails.
      await transaction.rollback();

      throw error;
    }
  }

  async findMe(userId: string, page = 1, limit = 10) {
    const freelancer = await this.freelancerModel.findOne({
      where: {
        userId,
      },
      attributes: ['id'],
    });

    if (!freelancer) {
      throw new NotFoundException(messages.freelancer.notFound);
    }

    const offset = (page - 1) * limit;

    const cacheKey = `reviews:freelancer:${freelancer.id}:${page}:${limit}`;

    const cachedReviews = await this.redis.getJSON(cacheKey);

    if (cachedReviews) {
      return response(cachedReviews, null);
    }

    const { rows: reviews, count: total } =
      await this.reviewModel.findAndCountAll({
        include: [
          {
            model: Service,
            where: {
              freelancerId: freelancer.id,
            },
            attributes: ['id', 'title'],
          },
          {
            model: User,
            as: 'client',
            attributes: ['id', 'firstName', 'lastName'],
            include: [
              {
                model: UserProfile,
                as: 'profile',
                attributes: ['avatar'],
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

    const totalPages = Math.ceil(total / limit);

    const result = {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    await this.redis.set(cacheKey, result, 5 * 60);

    return response(result, null);
  }

  async findByFreelancer(userId: string, page = 1, limit = 10) {
    const freelancer = await this.freelancerModel.findOne({
      where: {
        userId,
      },
      attributes: ['id'],
    });

    if (!freelancer) {
      throw new NotFoundException(messages.freelancer.notFound);
    }

    const offset = (page - 1) * limit;

    const cacheKey = `reviews:freelancer:${freelancer.id}:${page}:${limit}`;

    const cachedReviews = await this.redis.getJSON(cacheKey);

    if (cachedReviews) {
      return response(cachedReviews, null);
    }

    const { rows: reviews, count: total } =
      await this.reviewModel.findAndCountAll({
        include: [
          {
            model: Service,
            where: {
              freelancerId: freelancer.id,
            },
            attributes: ['id', 'title'],
          },
          {
            model: User,
            as: 'client',
            attributes: ['id', 'firstName', 'lastName'],
            include: [
              {
                model: UserProfile,
                as: 'profile',
                attributes: ['avatar'],
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

    const totalPages = Math.ceil(total / limit);

    const result = {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    await this.redis.set(cacheKey, result, 5 * 60);

    return response(result, null);
  }

  async findAllByService(serviceId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    // Create a unique Redis key for each service, page, and limit combination.
    const cacheKey = `reviews:service:${serviceId}:${page}:${limit}`;

    // Try to get the requested page from Redis cache first.
    const cachedReviews = await this.redis.getJSON(cacheKey);

    // Return cached reviews immediately when they exist.
    if (cachedReviews) {
      return response(cachedReviews, null);
    }

    const { rows: reviews, count: total } =
      await this.reviewModel.findAndCountAll({
        where: {
          serviceId,
        },
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['id', 'firstName', 'lastName'],
            include: [
              {
                model: UserProfile,
                as: 'profile',
                attributes: ['avatar'],
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

    const totalPages = Math.ceil(total / limit);

    const result = {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    // Cache the requested page for 5 minutes.
    await this.redis.set(cacheKey, result, 5 * 60);

    return response(result, null);
  }

  async findOne(id: string) {
    // Create a unique Redis key for the review.
    const cacheKey = `review:${id}`;

    // Try to get the review from Redis cache first.
    const cachedReview = await this.redis.getJSON(cacheKey);

    // Return the cached review when it exists.
    if (cachedReview) {
      return response(cachedReview, null);
    }

    const review = await this.reviewModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
        {
          model: Service,
          attributes: ['id', 'title'],
        },
        {
          model: Freelancer,
          attributes: [
            'id',
            'userId',
            'jobTitle',
            'ratingAverage',
            'ratingCount',
          ],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName'],
              include: [
                {
                  model: UserProfile,
                  as: 'profile',
                  attributes: ['avatar'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!review) {
      throw new NotFoundException(messages.review.notFound);
    }

    // Cache the review for 5 minutes.
    await this.redis.set(cacheKey, review, 5 * 60);

    // Return the review.
    return response(review, null);
  }
}
