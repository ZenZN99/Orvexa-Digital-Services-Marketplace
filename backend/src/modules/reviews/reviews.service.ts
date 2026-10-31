import type { Sequelize } from 'sequelize';
import type { RedisManager } from '../../config/db/redis/redis';
import type { ContractSchema } from '../contracts/schemas/contract.schema';
import { FreelancerSchema } from '../freelancers/schemas/freelancer.schema';
import type { PaymentSchema } from '../payments/schemas/payment.schema';
import { ServiceSchema } from '../services/schemas/service.schema';
import { UserSchema } from '../users/schemas/user.schema';
import type { ReviewSchema } from './schemas/review.schema';
import { Validator } from 'riser-bob';
import { CreateReviewRule } from './rules/create';
import { UserProfileSchema } from '../user-profiles/schemas/user-profile.schema';
import { ContractStatus } from '../contracts/schemas/enums/contract.enum';
import { PaymentStatus } from '../payments/schemas/enums/payment.enum';
import { buildPagination } from '../../utilities/pagination';
import type { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/schemas/enums/notification.enum';

// Shape stored in Redis and returned under `data` for every paginated list.
type ReviewsPagePayload = {
  reviews: ReviewSchema[];
  pagination: ReturnType<typeof buildPagination>;
};

const CACHE_TTL_SECONDS = 5 * 60;
// Must be much longer than CACHE_TTL_SECONDS so a version never resets while
// pages cached under it are still alive.
const VERSION_TTL_SECONDS = 24 * 60 * 60;

export class ReviewsService {
  constructor(
    private readonly reviewSchema: typeof ReviewSchema,
    private readonly contractSchema: typeof ContractSchema,
    private readonly userSchema: typeof UserSchema,
    private readonly paymentSchema: typeof PaymentSchema,
    private readonly serviceSchema: typeof ServiceSchema,
    private readonly freelancerSchema: typeof FreelancerSchema,
    private readonly notificationsService: NotificationsService,
    private readonly redisManager: RedisManager,
    private readonly sequelize: Sequelize,
  ) {}

  // Checks that a cached value really has the paginated-list shape.
  private isReviewsPagePayload(value: unknown): value is ReviewsPagePayload {
    return (
      typeof value === 'object' &&
      value !== null &&
      Array.isArray((value as { reviews?: unknown }).reviews) &&
      'pagination' in value
    );
  }

  // Builds a list cache key that includes the current version of its scope.
  private async buildListCacheKey(
    scope: 'service' | 'freelancer',
    id: string,
    page: number,
    limit: number,
  ) {
    const versionEntry = await this.redisManager.getJSON(
      `reviews:version:${scope}:${id}`,
    );

    const stamp =
      typeof versionEntry === 'object' &&
      versionEntry !== null &&
      'v' in versionEntry
        ? String((versionEntry as { v: unknown }).v)
        : '0';

    return `reviews:${scope}:${id}:v${stamp}:${page}:${limit}`;
  }

  // Invalidates every cached page of the affected service and freelancer lists
  // by changing their version, so old keys are never read again.
  private async invalidateListCaches(serviceId: string, freelancerId: string) {
    const stamp = {
      v: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };

    await Promise.all([
      this.redisManager.set(
        `reviews:version:service:${serviceId}`,
        stamp,
        VERSION_TTL_SECONDS,
      ),
      this.redisManager.set(
        `reviews:version:freelancer:${freelancerId}`,
        stamp,
        VERSION_TTL_SECONDS,
      ),
    ]);
  }

  async create(
    clientId: string,
    contractId: string,
    body: {
      rating: number;
      comment: string | null;
    },
  ) {
    const transaction = await this.sequelize.transaction();
    let committed = false;

    try {
      // Find the completed contract that belongs to the current client.
      const contract = await this.contractSchema.findOne({
        where: {
          id: contractId,
          clientId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!contract) {
        await transaction.rollback();

        return {
          error: true,
          statusCode: 404,
          message: 'Contract not found',
        } as const;
      }

      const client = await this.userSchema.findByPk(clientId, {
        attributes: ['id', 'firstName', 'lastName'],
        include: [
          {
            model: UserProfileSchema,
            as: 'profile',
            attributes: ['avatar'],
          },
        ],
        transaction,
      });

      if (!client) {
        await transaction.rollback();

        return {
          error: true,
          statusCode: 404,
          message: 'Client not found',
        } as const;
      }

      // Only completed contracts are allowed to receive a review.
      if (contract.status !== ContractStatus.COMPLETED) {
        await transaction.rollback();

        return {
          error: true,
          statusCode: 400,
          message: 'Only completed contracts can be reviewed',
        } as const;
      }

      // Make sure the client has not already reviewed this contract.
      const existingReview = await this.reviewSchema.findOne({
        where: {
          contractId: contract.id,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (existingReview) {
        await transaction.rollback();

        return {
          error: true,
          statusCode: 400,
          message: 'You have already reviewed this contract',
        } as const;
      }

      // Verify that the order associated with this contract has a successful payment.
      const payment = await this.paymentSchema.findOne({
        where: {
          orderId: contract.orderId,
          userId: clientId,
          status: PaymentStatus.COMPLETED,
        },
        transaction,
      });

      if (!payment) {
        await transaction.rollback();

        return {
          error: true,
          statusCode: 400,
          message: 'A completed payment is required to review this contract',
        } as const;
      }

      const validation = Validator.validate(body, CreateReviewRule);

      if (!validation.valid) {
        await transaction.rollback();

        return {
          error: true,
          statusCode: 422,
          message: 'Validation failed',
          errors: validation.errors,
        } as const;
      }

      const data = validation.data as ReviewSchema;

      // Create the review using the service and client from the completed contract.
      const review = await this.reviewSchema.create(
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
      const serviceReviews = await this.reviewSchema.findAll({
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
      await this.serviceSchema.update(
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
      const freelancer = await this.freelancerSchema.findByPk(
        contract.freelancerId,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        },
      );

      if (!freelancer) {
        // Rolls back the review and service rating written above.
        await transaction.rollback();

        return {
          error: true,
          statusCode: 404,
          message: 'Freelancer not found',
        } as const;
      }

      const freelancerReviews = await this.reviewSchema.findAll({
        include: [
          {
            model: ServiceSchema,
            as: 'service',
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
      await this.freelancerSchema.update(
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
      committed = true;

      // The review is already committed: failures below must not fail the request.
      try {
        await this.invalidateListCaches(review.serviceId, freelancer.id);
      } catch (cacheError) {
        console.error('Failed to invalidate reviews cache:', cacheError);
      }

      try {
        await this.notificationsService.create({
          senderId: clientId,
          receiverId: freelancer.userId,
          targetId: review.id,
          type: NotificationType.REVIEW_CREATED,
          message: `A client ${client.firstName} ${client.lastName} has reviewed your service.`,
          link: `/service/${review.serviceId}`,
        });
      } catch (notificationError) {
        console.error(
          'Failed to create review notification:',
          notificationError,
        );
      }

      return {
        success: true,
        message: 'Review created successfully',
        data: review,
      } as const;
    } catch (error) {
      // Roll back the entire operation if any step fails (unless already committed).
      if (!committed) {
        try {
          await transaction.rollback();
        } catch {
          // Keep the original error below.
        }
      }

      throw error;
    }
  }

  async findMe(
    userId: string,
    page = 1,
    limit = 10,
    offset = (page - 1) * limit,
  ) {
    const freelancer = await this.freelancerSchema.findOne({
      where: {
        userId,
      },
      attributes: ['id'],
    });

    if (!freelancer) {
      return {
        error: true,
        message: 'Freelancer not found',
      } as const;
    }

    const cacheKey = await this.buildListCacheKey(
      'freelancer',
      freelancer.id,
      page,
      limit,
    );

    const cachedReviews = await this.redisManager.getJSON(cacheKey);

    if (this.isReviewsPagePayload(cachedReviews)) {
      return {
        success: true,
        data: {
          reviews: cachedReviews.reviews,
          pagination: cachedReviews.pagination,
        },
      } as const;
    }

    const { rows: reviews, count: total } =
      await this.reviewSchema.findAndCountAll({
        include: [
          {
            model: ServiceSchema,
            as: 'service',
            where: {
              freelancerId: freelancer.id,
            },
            attributes: ['id', 'title'],
          },
          {
            model: UserSchema,
            as: 'client',
            attributes: ['id', 'firstName', 'lastName'],
            include: [
              {
                model: UserProfileSchema,
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

    const data: ReviewsPagePayload = {
      reviews,
      pagination: buildPagination(total, page, limit),
    };

    await this.redisManager.set(cacheKey, data, CACHE_TTL_SECONDS);

    return {
      success: true,
      data,
    } as const;
  }

  async findByFreelancer(
    userId: string,
    page = 1,
    limit = 10,
    offset = (page - 1) * limit,
  ) {
    const freelancer = await this.freelancerSchema.findOne({
      where: {
        userId,
      },
      attributes: ['id'],
    });

    if (!freelancer) {
      return {
        error: true,
        message: 'Freelancer not found',
      } as const;
    }

    const cacheKey = await this.buildListCacheKey(
      'freelancer',
      freelancer.id,
      page,
      limit,
    );

    const cachedReviews = await this.redisManager.getJSON(cacheKey);

    if (this.isReviewsPagePayload(cachedReviews)) {
      return {
        success: true,
        data: {
          reviews: cachedReviews.reviews,
          pagination: cachedReviews.pagination,
        },
      } as const;
    }

    const { rows: reviews, count: total } =
      await this.reviewSchema.findAndCountAll({
        include: [
          {
            model: ServiceSchema,
            as: 'service',
            where: {
              freelancerId: freelancer.id,
            },
            attributes: ['id', 'title'],
          },
          {
            model: UserSchema,
            as: 'client',
            attributes: ['id', 'firstName', 'lastName'],
            include: [
              {
                model: UserProfileSchema,
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

    const data: ReviewsPagePayload = {
      reviews,
      pagination: buildPagination(total, page, limit),
    };

    await this.redisManager.set(cacheKey, data, CACHE_TTL_SECONDS);

    return {
      success: true,
      data,
    } as const;
  }

  async findAllByService(
    serviceId: string,
    page = 1,
    limit = 10,
    offset = (page - 1) * limit,
  ) {
    // Create a unique Redis key for each service version, page, and limit combination.
    const cacheKey = await this.buildListCacheKey(
      'service',
      serviceId,
      page,
      limit,
    );

    // Try to get the requested page from Redis cache first.
    const cachedReviews = await this.redisManager.getJSON(cacheKey);

    // Return cached reviews immediately when they exist (same shape as DB response).
    if (this.isReviewsPagePayload(cachedReviews)) {
      return {
        success: true,
        data: {
          reviews: cachedReviews.reviews,
          pagination: cachedReviews.pagination,
        },
      } as const;
    }

    const { rows: reviews, count: total } =
      await this.reviewSchema.findAndCountAll({
        where: {
          serviceId,
        },
        include: [
          {
            model: UserSchema,
            as: 'client',
            attributes: ['id', 'firstName', 'lastName'],
            include: [
              {
                model: UserProfileSchema,
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

    const data: ReviewsPagePayload = {
      reviews,
      pagination: buildPagination(total, page, limit),
    };

    // Cache the requested page for 5 minutes.
    await this.redisManager.set(cacheKey, data, CACHE_TTL_SECONDS);

    return {
      success: true,
      data,
    } as const;
  }

  async findOne(reviewId: string) {
    // Create a unique Redis key for the review.
    const cacheKey = `review:${reviewId}`;

    // Try to get the review from Redis cache first.
    const cachedReview = await this.redisManager.getJSON(cacheKey);

    // Return the cached review under the same `review` key as the DB path.
    if (cachedReview) {
      return {
        review: cachedReview,
      } as const;
    }

    const review = await this.reviewSchema.findByPk(reviewId, {
      include: [
        {
          model: UserSchema,
          as: 'client',
          attributes: ['id', 'firstName', 'lastName'],
          include: [
            {
              model: UserProfileSchema,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
        {
          model: ServiceSchema,
          as: 'service',
          attributes: ['id', 'title'],
        },
        {
          model: FreelancerSchema,
          as: 'freelancer',
          attributes: [
            'id',
            'userId',
            'jobTitle',
            'ratingAverage',
            'ratingCount',
          ],
          include: [
            {
              model: UserSchema,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName'],
              include: [
                {
                  model: UserProfileSchema,
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
      return {
        error: true,
        message: 'Review not found',
      } as const;
    }

    // Cache the review for 5 minutes.
    await this.redisManager.set(cacheKey, review, CACHE_TTL_SECONDS);

    return { review } as const;
  }
}
