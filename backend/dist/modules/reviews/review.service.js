var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './schema/review.schema.js';
import { Contract } from '../contracts/schema/contract.schema.js';
import { Payment } from '../payments/schema/payment.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { User } from '../users/schema/user.schema.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { ContractStatus } from '../../common/enums/contract.enum.js';
import { PaymentStatus } from '../../common/enums/payment.enum.js';
import { messages } from '../../common/libs/messages.js';
import { response } from '../../common/libs/response.js';
import { Sequelize } from 'sequelize-typescript';
import { NotificationService } from '../notifications/notification.service.js';
import { NotificationType } from '../../common/enums/notification.enum.js';
import { RedisHelper } from '../../infrastructure/database/redis/redis.helper.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
let ReviewService = class ReviewService {
    reviewModel;
    contractModel;
    userModel;
    paymentModel;
    serviceModel;
    freelancerModel;
    notificationService;
    redis;
    sequelize;
    constructor(reviewModel, contractModel, userModel, paymentModel, serviceModel, freelancerModel, notificationService, redis, sequelize) {
        this.reviewModel = reviewModel;
        this.contractModel = contractModel;
        this.userModel = userModel;
        this.paymentModel = paymentModel;
        this.serviceModel = serviceModel;
        this.freelancerModel = freelancerModel;
        this.notificationService = notificationService;
        this.redis = redis;
        this.sequelize = sequelize;
    }
    async create(clientId, contractId, data) {
        const transaction = await this.sequelize.transaction();
        try {
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
            if (contract.status !== ContractStatus.COMPLETED) {
                throw new BadRequestException(messages.review.create.contractNotCompleted);
            }
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
            const payment = await this.paymentModel.findOne({
                where: {
                    orderId: contract.orderId,
                    userId: clientId,
                    status: PaymentStatus.COMPLETED,
                },
                transaction,
            });
            if (!payment) {
                throw new BadRequestException(messages.review.create.paymentNotCompleted);
            }
            const review = await this.reviewModel.create({
                serviceId: contract.serviceId,
                clientId,
                contractId: contract.id,
                freelancerId: contract.freelancerId,
                rating: data.rating,
                comment: data.comment ?? null,
            }, {
                transaction,
            });
            const serviceReviews = await this.reviewModel.findAll({
                where: {
                    serviceId: contract.serviceId,
                },
                attributes: ['rating'],
                transaction,
            });
            const serviceRatingCount = serviceReviews.length;
            const serviceRatingAverage = serviceReviews.reduce((total, review) => total + Number(review.rating), 0) / serviceRatingCount;
            await this.serviceModel.update({
                ratingCount: serviceRatingCount,
                ratingAverage: Number(serviceRatingAverage.toFixed(2)),
            }, {
                where: {
                    id: contract.serviceId,
                },
                transaction,
            });
            const freelancer = await this.freelancerModel.findByPk(contract.freelancerId, {
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
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
            const freelancerRatingAverage = freelancerReviews.reduce((total, review) => total + Number(review.rating), 0) / freelancerRatingCount;
            await this.freelancerModel.update({
                ratingCount: freelancerRatingCount,
                ratingAverage: Number(freelancerRatingAverage.toFixed(2)),
            }, {
                where: {
                    id: freelancer.id,
                },
                transaction,
            });
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
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async findMe(userId, page = 1, limit = 10) {
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
        const { rows: reviews, count: total } = await this.reviewModel.findAndCountAll({
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
    async findByFreelancer(userId, page = 1, limit = 10) {
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
        const { rows: reviews, count: total } = await this.reviewModel.findAndCountAll({
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
    async findAllByService(serviceId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const cacheKey = `reviews:service:${serviceId}:${page}:${limit}`;
        const cachedReviews = await this.redis.getJSON(cacheKey);
        if (cachedReviews) {
            return response(cachedReviews, null);
        }
        const { rows: reviews, count: total } = await this.reviewModel.findAndCountAll({
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
        await this.redis.set(cacheKey, result, 5 * 60);
        return response(result, null);
    }
    async findOne(id) {
        const cacheKey = `review:${id}`;
        const cachedReview = await this.redis.getJSON(cacheKey);
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
        await this.redis.set(cacheKey, review, 5 * 60);
        return response(review, null);
    }
};
ReviewService = __decorate([
    Injectable(),
    __param(0, InjectModel(Review)),
    __param(1, InjectModel(Contract)),
    __param(2, InjectModel(User)),
    __param(3, InjectModel(Payment)),
    __param(4, InjectModel(Service)),
    __param(5, InjectModel(Freelancer)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, NotificationService,
        RedisHelper,
        Sequelize])
], ReviewService);
export { ReviewService };
//# sourceMappingURL=review.service.js.map