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
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from './schema/service.schema.js';
import { CloudinaryService } from '../../infrastructure/cloudinary/cloudinary.service.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { messages } from '../../common/libs/messages.js';
import { ServiceStatus } from '../../common/enums/service.enum.js';
import { response } from '../../common/libs/response.js';
import { User } from '../users/schema/user.schema.js';
import { NotificationService } from '../notifications/notification.service.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { NotificationType } from '../../common/enums/notification.enum.js';
import { RedisHelper } from '../../infrastructure/database/redis/redis.helper.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
let ServiceService = class ServiceService {
    serviceModel;
    freelancerModel;
    userModel;
    cloudinaryService;
    notificationService;
    redis;
    constructor(serviceModel, freelancerModel, userModel, cloudinaryService, notificationService, redis) {
        this.serviceModel = serviceModel;
        this.freelancerModel = freelancerModel;
        this.userModel = userModel;
        this.cloudinaryService = cloudinaryService;
        this.notificationService = notificationService;
        this.redis = redis;
    }
    async create(userId, data, images) {
        const freelancer = await this.freelancerModel.findOne({
            where: { userId },
        });
        if (!freelancer) {
            throw new NotFoundException(messages.freelancer.notFound);
        }
        const servicesCount = await this.serviceModel.count({
            where: {
                freelancerId: freelancer.id,
            },
        });
        if (servicesCount >= 15) {
            throw new BadRequestException(messages.service.create.maxServices);
        }
        if (!images?.length) {
            throw new BadRequestException(messages.service.imagesRequired);
        }
        const uploadedImages = [];
        for (const image of images) {
            const result = await this.cloudinaryService.upload(image, 'services');
            uploadedImages.push({
                url: result.url,
                publicId: result.publicId,
            });
        }
        const service = await this.serviceModel.create({
            freelancerId: freelancer.id,
            category: data.category,
            title: data.title,
            description: data.description,
            features: data.features,
            keywords: data.keywords,
            images: uploadedImages,
            price: data.price,
            deliveryDays: data.deliveryDays,
            status: ServiceStatus.PENDING,
        });
        const admins = await this.userModel.findAll({
            where: {
                role: UserRole.ADMIN,
            },
        });
        for (const admin of admins) {
            await this.notificationService.create({
                senderId: freelancer.userId,
                receiverId: admin.id,
                targetId: service.id,
                type: NotificationType.SERVICE_REVIEW,
                message: 'A new service is waiting for your review.',
                link: `/admin`,
            });
        }
        return response(service, messages.service.create.success);
    }
    async findAll(page = 1, limit = 10) {
        const key = `services:list:${page}:${limit}`;
        const cached = await this.redis.getJSON(key);
        if (cached) {
            return response(cached, null);
        }
        const offset = (page - 1) * limit;
        const { rows: services, count: total } = await this.serviceModel.findAndCountAll({
            where: { status: ServiceStatus.PUBLISHED },
            include: [
                {
                    model: Freelancer,
                    include: [
                        {
                            model: User,
                            include: [
                                {
                                    model: UserProfile,
                                },
                            ],
                        },
                    ],
                },
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });
        const totalPages = Math.ceil(total / limit);
        const result = {
            services,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
        await this.redis.set(key, result, 5 * 60);
        return response(result, null);
    }
    async findMe(userId) {
        const freelancer = await this.freelancerModel.findOne({
            where: { userId },
        });
        if (!freelancer) {
            throw new NotFoundException(messages.freelancer.notFound);
        }
        const services = await this.serviceModel.findAll({
            where: { freelancerId: freelancer.id },
            order: [['createdAt', 'DESC']],
        });
        return response(services, null);
    }
    async findByFreelancer(userId) {
        const freelancer = await this.freelancerModel.findOne({
            where: { userId },
        });
        if (!freelancer) {
            throw new NotFoundException(messages.freelancer.notFound);
        }
        const services = await this.serviceModel.findAll({
            where: { freelancerId: freelancer.id },
            order: [['createdAt', 'DESC']],
        });
        return response(services, null);
    }
    async findOne(serviceId) {
        const key = `service:${serviceId}`;
        const cached = await this.redis.getJSON(key);
        if (cached) {
            return response(cached, null);
        }
        const service = await this.serviceModel.findOne({
            where: {
                id: serviceId,
                status: ServiceStatus.PUBLISHED,
            },
            include: [
                {
                    model: Freelancer,
                    include: [
                        {
                            model: User,
                            include: [
                                {
                                    model: UserProfile,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        if (!service) {
            throw new NotFoundException(messages.service.notFound);
        }
        await this.redis.set(key, service, 5 * 60);
        return response(service, null);
    }
    async findPending(page = 1, limit = 10) {
        const key = `services:pending:${page}:${limit}`;
        const cached = await this.redis.getJSON(key);
        if (cached) {
            return response(cached, null);
        }
        const offset = (page - 1) * limit;
        const { rows: services, count: total } = await this.serviceModel.findAndCountAll({
            where: {
                status: ServiceStatus.PENDING,
            },
            include: [
                {
                    model: Freelancer,
                    include: [
                        {
                            model: User,
                            include: [
                                {
                                    model: UserProfile,
                                },
                            ],
                        },
                    ],
                },
            ],
            offset,
            limit,
            order: [['createdAt', 'DESC']],
        });
        const totalPages = Math.ceil(total / limit);
        const result = {
            services,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
        await this.redis.set(key, result, 60);
        return response(result, null);
    }
    async update(userId, serviceId, data, images) {
        const freelancer = await this.freelancerModel.findOne({
            where: { userId },
        });
        if (!freelancer) {
            throw new NotFoundException(messages.freelancer.notFound);
        }
        const service = await this.serviceModel.findOne({
            where: {
                id: serviceId,
                freelancerId: freelancer.id,
            },
        });
        if (!service) {
            throw new NotFoundException(messages.service.notFound);
        }
        if (images !== undefined && images.length === 0) {
            throw new BadRequestException(messages.service.imagesRequired);
        }
        if (images?.length) {
            for (const image of service.images) {
                await this.cloudinaryService.destroy(image.publicId);
            }
            const uploadedImages = [];
            for (const image of images) {
                const result = await this.cloudinaryService.upload(image, 'services');
                uploadedImages.push({
                    url: result.url,
                    publicId: result.publicId,
                });
            }
            service.images = uploadedImages;
        }
        const updateData = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
        await service.update(updateData);
        service.status = ServiceStatus.PENDING;
        service.reason = null;
        await service.save();
        const admins = await this.userModel.findAll({
            where: {
                role: UserRole.ADMIN,
            },
        });
        for (const admin of admins) {
            await this.notificationService.create({
                senderId: freelancer.userId,
                receiverId: admin.id,
                targetId: service.id,
                type: NotificationType.SERVICE_REVIEW,
                message: 'A new service is waiting for your review.',
                link: '/admin',
            });
        }
        return response(service, messages.service.update.success);
    }
    async updateStatus(serviceId, adminId, status, reason) {
        const service = await this.serviceModel.findByPk(serviceId);
        if (!service) {
            throw new NotFoundException(messages.service.notFound);
        }
        if (service.status === status) {
            throw new BadRequestException(messages.service.updateStatus.alreadySameStatus);
        }
        if (status === ServiceStatus.REJECTED && !reason) {
            throw new BadRequestException(messages.service.updateStatus.reasonRequired);
        }
        service.status = status;
        if (status === ServiceStatus.REJECTED) {
            service.reason = reason;
        }
        else {
            service.reason = null;
        }
        await service.save();
        const freelancer = await this.freelancerModel.findByPk(service.freelancerId);
        if (freelancer) {
            await this.notificationService.create({
                senderId: adminId,
                receiverId: freelancer.userId,
                targetId: service.id,
                type: status === ServiceStatus.PUBLISHED
                    ? NotificationType.SERVICE_APPROVED
                    : NotificationType.SERVICE_REJECTED,
                message: status === ServiceStatus.PUBLISHED
                    ? 'Your service has been approved and published.'
                    : `Your service has been rejected. Reason: ${service.reason}`,
                link: "/services/status",
            });
        }
        return response(service, messages.service.updateStatus.success);
    }
    async destroy(currentUser, serviceId) {
        const service = await this.serviceModel.findByPk(serviceId);
        if (!service) {
            throw new NotFoundException(messages.service.notFound);
        }
        if (service.status === ServiceStatus.PENDING) {
            throw new BadRequestException(messages.service.destroy.pending);
        }
        const freelancer = await this.freelancerModel.findOne({
            where: {
                userId: currentUser.id,
            },
        });
        if (!freelancer) {
            throw new NotFoundException(messages.freelancer.notFound);
        }
        const isOwner = freelancer.id === service.freelancerId;
        const isAdmin = currentUser.role === UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new ForbiddenException(messages.service.destroy.forbidden);
        }
        for (const image of service.images) {
            await this.cloudinaryService.destroy(image.publicId);
        }
        await service.destroy();
        return response(null, messages.service.destroy.success);
    }
};
ServiceService = __decorate([
    Injectable(),
    __param(0, InjectModel(Service)),
    __param(1, InjectModel(Freelancer)),
    __param(2, InjectModel(User)),
    __metadata("design:paramtypes", [Object, Object, Object, CloudinaryService,
        NotificationService,
        RedisHelper])
], ServiceService);
export { ServiceService };
//# sourceMappingURL=service.service.js.map