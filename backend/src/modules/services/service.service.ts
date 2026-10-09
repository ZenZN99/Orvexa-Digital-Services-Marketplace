import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from './schema/service.schema.js';
import { CloudinaryService } from '../../infrastructure/cloudinary/cloudinary.service.js';
import { CreateServiceDTO } from './dto/create.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { messages } from '../../common/libs/messages.js';
import { ServiceStatus } from '../../common/enums/service.enum.js';
import { response } from '../../common/libs/response.js';
import { User } from '../users/schema/user.schema.js';
import { UpdateServiceDTO } from './dto/update.js';
import { NotificationService } from '../notifications/notification.service.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { NotificationType } from '../../common/enums/notification.enum.js';
import { RedisHelper } from '../../infrastructure/database/redis/redis.helper.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
import { FRONTEND_URL } from '../../url.js';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service) private readonly serviceModel: typeof Service,
    @InjectModel(Freelancer)
    private readonly freelancerModel: typeof Freelancer,
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationService: NotificationService,
    private readonly redis: RedisHelper,
  ) {}

  async create(
    userId: string,
    data: CreateServiceDTO,
    images: Express.Multer.File[],
  ) {
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

    // Check Redis first to avoid querying PostgreSQL when cached data exists.
    const cached = await this.redis.getJSON(key);

    if (cached) {
      return response(cached, null);
    }

    const offset = (page - 1) * limit;

    const { rows: services, count: total } =
      await this.serviceModel.findAndCountAll({
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

    // Store the service list in Redis for 5 minutes.
    await this.redis.set(key, result, 5 * 60);

    return response(result, null);
  }

  async findMe(userId: string) {
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

  async findByFreelancer(userId: string) {
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
  async findOne(serviceId: string) {
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

    const { rows: services, count: total } =
      await this.serviceModel.findAndCountAll({
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

  async update(
    userId: string,
    serviceId: string,
    data: UpdateServiceDTO,
    images?: Express.Multer.File[],
  ) {
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

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );

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

  async updateStatus(
    serviceId: string,
    adminId: string,
    status: ServiceStatus,
    reason?: string,
  ) {
    const service = await this.serviceModel.findByPk(serviceId);

    if (!service) {
      throw new NotFoundException(messages.service.notFound);
    }

    if (service.status === status) {
      throw new BadRequestException(
        messages.service.updateStatus.alreadySameStatus,
      );
    }

    if (status === ServiceStatus.REJECTED && !reason) {
      throw new BadRequestException(
        messages.service.updateStatus.reasonRequired,
      );
    }

    service.status = status;

    if (status === ServiceStatus.REJECTED) {
      service.reason = reason as string;
    } else {
      service.reason = null;
    }

    await service.save();

    const freelancer = await this.freelancerModel.findByPk(
      service.freelancerId,
    );

    if (freelancer) {
      await this.notificationService.create({
        senderId: adminId,
        receiverId: freelancer.userId,
        targetId: service.id,
        type:
          status === ServiceStatus.PUBLISHED
            ? NotificationType.SERVICE_APPROVED
            : NotificationType.SERVICE_REJECTED,
        message:
          status === ServiceStatus.PUBLISHED
            ? 'Your service has been approved and published.'
            : `Your service has been rejected. Reason: ${service.reason}`,
        link: "/services/status",
      });
    }
    return response(service, messages.service.updateStatus.success);
  }

  async destroy(currentUser: User, serviceId: string) {
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
}
