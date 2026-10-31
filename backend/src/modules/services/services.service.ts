import { Validator } from 'riser-bob';
import type { CloudinaryManager } from '../../config/cloudinary/cloudinary';
import { FreelancerSchema } from '../freelancers/schemas/freelancer.schema';
import {
  ServiceStatus,
  type ServiceCategory,
} from './schemas/enums/service.enum';
import type { ServiceSchema } from './schemas/service.schema';
import { CreateServiceRule } from './rules/create';
import {
  UserSchema,
  type AuthenticationUser,
} from '../users/schemas/user.schema';
import { UserProfileSchema } from '../user-profiles/schemas/user-profile.schema';
import { buildPagination } from '../../utilities/pagination';
import { UpdateServiceRule } from './rules/update';
import { UpdateServiceStatusRule } from './rules/update-status';
import { UserRole } from '../users/schemas/enums/users.enum';
import { NotificationType } from '../notifications/schemas/enums/notification.enum';
import type { NotificationsService } from '../notifications/notifications.service';

export class ServicesService {
  constructor(
    private readonly serviceSchema: typeof ServiceSchema,
    private readonly freelancerSchema: typeof FreelancerSchema,
    private readonly userSchema: typeof UserSchema,
    private readonly notificationsService: NotificationsService,
    private readonly cloudinaryManager: CloudinaryManager,
  ) {}

  async create(
    userId: string,
    formData: {
      get(name: string): string | File | null;
      getAll(name: string): (string | File)[];
    },
  ) {
    const freelancer = await this.freelancerSchema.findOne({
      where: { userId },
    });

    if (!freelancer) {
      return {
        error: true,
        statusCode: 404,
        message: 'Freelancer not found',
      } as const;
    }

    const servicesCount = await this.serviceSchema.count({
      where: { freelancerId: freelancer.id },
    });

    if (servicesCount >= 15) {
      return {
        error: true,
        statusCode: 400,
        message: 'You have reached the maximum limit of 15 services.',
      } as const;
    }

    console.log('FEATURES:', formData.get('features'));
    console.log('ALL FEATURES:', formData.getAll('features'));
    console.log('KEYWORDS:', formData.get('keywords'));

    const body = {
      category: formData.get('category') as ServiceCategory,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      deliveryDays: Number(formData.get('deliveryDays')),
      features: formData.getAll('features') as string[],
      keywords: formData.getAll('keywords') as string[],
    };

    const validation = Validator.validate(body, CreateServiceRule);

    if (!validation.valid) {
      return {
        error: true,
        statusCode: 400,
        message: 'Validation failed',
        errors: validation.errors,
      } as const;
    }

    const {
      category,
      title,
      description,
      features,
      keywords,
      price,
      deliveryDays,
    } = validation.data as ServiceSchema;

    const files = formData
      .getAll('images')
      .filter(
        (value): value is File => value instanceof File && value.size > 0,
      );

    if (files.length === 0) {
      return {
        error: true,
        statusCode: 400,
        message: 'At least one image is required.',
      } as const;
    }

    if (files.length > 5) {
      return {
        error: true,
        statusCode: 400,
        message: 'You can upload a maximum of 5 images.',
      } as const;
    }

    const uploadedImages: { url: string; publicId: string }[] = [];

    try {
      for (const file of files) {
        const image = await this.cloudinaryManager.upload(file, 'services');
        uploadedImages.push(image);
      }

      const service = await this.serviceSchema.create({
        freelancerId: freelancer.id,
        category,
        title,
        description,
        features,
        keywords,
        price,
        deliveryDays,
        images: uploadedImages,
        status: ServiceStatus.PENDING,
      });

      const admins = await this.userSchema.findAll({
        where: {
          role: UserRole.ADMIN,
        },
      });

      for (const admin of admins) {
        await this.notificationsService.create({
          senderId: freelancer.userId,
          receiverId: admin.id,
          targetId: service.id,
          type: NotificationType.SERVICE_REVIEW,
          message: 'A new service is waiting for your review.',
          link: `/admin`,
        });
      }

      return {
        success: true,
        message: 'Service created successfully',
        data: service,
      } as const;
    } catch (error) {
      await Promise.allSettled(
        uploadedImages.map((image) =>
          this.cloudinaryManager.destroy(image.publicId),
        ),
      );

      throw error;
    }
  }

  async findAll(page = 1, limit = 10, offset = (page - 1) * limit) {
    const { rows: services, count: total } =
      await this.serviceSchema.findAndCountAll({
        where: {
          status: ServiceStatus.PUBLISHED,
        },
        include: [
          {
            model: FreelancerSchema,
            as: 'freelancer',
            include: [
              {
                model: UserSchema,
                as: 'user',
                include: [
                  {
                    model: UserProfileSchema,
                    as: 'profile',
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

    return {
      success: true,
      data: services,
      pagination: buildPagination(total, page, limit),
    } as const;
  }

  async findMe(userId: string) {
    const freelancer = await this.freelancerSchema.findOne({
      where: { userId },
    });

    if (!freelancer) {
      return {
        error: true,
        message: 'Freelancer not found',
      } as const;
    }

    const services = await this.serviceSchema.findAll({
      where: { freelancerId: freelancer.id },
      order: [['createdAt', 'DESC']],
    });

    return {
      success: true,
      data: services,
    } as const;
  }

  async findByFreelancer(userId: string) {
    const freelancer = await this.freelancerSchema.findOne({
      where: { userId },
    });

    if (!freelancer) {
      return {
        error: true,
        message: 'Freelancer not found',
      } as const;
    }

    const services = await this.serviceSchema.findAll({
      where: { freelancerId: freelancer.id },
      order: [['createdAt', 'DESC']],
    });

    return {
      success: true,
      data: services,
    } as const;
  }

  async findOne(serviceId: string) {
    const service = await this.serviceSchema.findOne({
      where: {
        id: serviceId,
        status: ServiceStatus.PUBLISHED,
      },

      include: [
        {
          model: FreelancerSchema,
          as: 'freelancer',
          include: [
            {
              model: UserSchema,
              as: 'user',
              include: [
                {
                  model: UserProfileSchema,
                  as: 'profile',
                },
              ],
            },
          ],
        },
      ],
    });

    if (!service) {
      return {
        error: true,
        message: 'Service not found',
      } as const;
    }

    return {
      success: true,
      data: service,
    } as const;
  }

  async findPending(page = 1, limit = 10, offset = (page - 1) * limit) {
    const { rows: services, count: total } =
      await this.serviceSchema.findAndCountAll({
        where: { status: ServiceStatus.PENDING },
        include: [
          {
            model: FreelancerSchema,
            as: 'freelancer',
            include: [
              {
                model: UserSchema,
                as: 'user',
                include: [
                  {
                    model: UserProfileSchema,
                    as: 'profile',
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

    return {
      success: true,
      data: services,
      pagination: buildPagination(total, page, limit),
    } as const;
  }

  async update(
    userId: string,
    serviceId: string,
    formData: {
      get(name: string): string | File | null;
      getAll(name: string): (string | File)[];
      has(name: string): boolean;
    },
  ) {
    const freelancer = await this.freelancerSchema.findOne({
      where: { userId },
    });

    if (!freelancer) {
      return {
        error: true,
        statusCode: 404,
        message: 'Freelancer not found',
      } as const;
    }

    const service = await this.serviceSchema.findOne({
      where: {
        id: serviceId,
        freelancerId: freelancer.id,
      },
    });

    if (!service) {
      return {
        error: true,
        statusCode: 404,
        message: 'Service not found',
      } as const;
    }

    const body = {
      category: formData.get('category') as ServiceCategory,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      deliveryDays: Number(formData.get('deliveryDays')),
      features: JSON.parse(
        String(formData.get('features') ?? '[]'),
      ) as string[],

      keywords: JSON.parse(
        String(formData.get('keywords') ?? '[]'),
      ) as string[],
    };

    const validation = Validator.validate(body, UpdateServiceRule);

    if (!validation.valid) {
      return {
        error: true,
        statusCode: 400,
        message: 'Validation failed',
        errors: validation.errors,
      } as const;
    }

    const updateData = Object.fromEntries(
      Object.entries(validation.data as Record<string, unknown>).filter(
        ([, value]) => value !== undefined,
      ),
    );

    const files = formData
      .getAll('images')
      .filter((value) => value instanceof File && value.size > 0) as File[];

    if (formData.has('images') && files.length === 0) {
      return {
        error: true,
        statusCode: 400,
        message: 'At least one image is required when updating images.',
      } as const;
    }

    if (files.length > 5) {
      return {
        error: true,
        statusCode: 400,
        message: 'You can upload a maximum of 5 images.',
      } as const;
    }

    const uploadedImages: { url: string; publicId: string }[] = [];

    try {
      if (files.length > 0) {
        for (const file of files) {
          const image = await this.cloudinaryManager.upload(file, 'services');

          uploadedImages.push(image);
        }

        updateData.images = uploadedImages;
      }

      await service.update({
        ...updateData,
        status: ServiceStatus.PENDING,
        reason: null,
      });

      if (files.length > 0) {
        await Promise.allSettled(
          service.images
            .filter(
              (image) =>
                !uploadedImages.some(
                  (uploaded) => uploaded.publicId === image.publicId,
                ),
            )
            .map((image) => this.cloudinaryManager.destroy(image.publicId)),
        );
      }

      const admins = await this.userSchema.findAll({
        where: {
          role: UserRole.ADMIN,
        },
      });

      for (const admin of admins) {
        await this.notificationsService.create({
          senderId: freelancer.userId,
          receiverId: admin.id,
          targetId: service.id,
          type: NotificationType.SERVICE_REVIEW,
          message: 'A new service is waiting for your review.',
          link: '/admin',
        });
      }

      return {
        success: true,
        message: 'Service updated successfully',
        data: service,
      } as const;
    } catch (error) {
      await Promise.allSettled(
        uploadedImages.map((image) =>
          this.cloudinaryManager.destroy(image.publicId),
        ),
      );

      throw error;
    }
  }

  async updateStatus(
    adminId: string,
    serviceId: string,
    status: ServiceStatus,
    reason: string,
  ) {
    const service = await this.serviceSchema.findByPk(serviceId);

    if (!service) {
      return {
        error: true,
        statusCode: 404,
        message: 'Service not found',
      } as const;
    }

    const body = {
      status,
      reason,
    };

    const validation = Validator.validate(body, UpdateServiceStatusRule);

    if (!validation.valid) {
      return {
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors: validation.errors,
      } as const;
    }

    if (service.status === status) {
      return {
        error: true,
        statusCode: 400,
        message: 'Service already has this status.',
      } as const;
    }

    if (status === ServiceStatus.REJECTED && !reason.trim()) {
      return {
        error: true,
        statusCode: 400,
        message: 'A reason is required when rejecting a service.',
      } as const;
    }

    service.status = status;

    if (status === ServiceStatus.REJECTED) {
      service.reason = reason as string;
    } else {
      service.reason = null;
    }

    await service.save();

    const freelancer = await this.freelancerSchema.findByPk(
      service.freelancerId,
    );

    if (freelancer) {
      await this.notificationsService.create({
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
        link: '/services/status',
      });
    }

    return {
      success: true,
      message: 'Service status updated successfully.',
      data: service,
    } as const;
  }

  async delete(currentUser: AuthenticationUser, serviceId: string) {
    const service = await this.serviceSchema.findByPk(serviceId);

    if (!service) {
      return {
        error: true,
        statusCode: 404,
        message: 'Service not found.',
      } as const;
    }

    if (service.status === ServiceStatus.PENDING) {
      return {
        error: true,
        statusCode: 400,
        message: 'Cannot delete a service pending review.',
      } as const;
    }

    const isAdmin = currentUser?.role === UserRole.ADMIN;

    if (!isAdmin) {
      const freelancer = await this.freelancerSchema.findOne({
        where: { userId: currentUser?.id },
      });

      if (!freelancer) {
        return {
          error: true,
          statusCode: 404,
          message: 'Freelancer not found.',
        } as const;
      }

      if (freelancer.id !== service.freelancerId) {
        return {
          error: true,
          statusCode: 403,
          message: 'You are not allowed to delete this service.',
        } as const;
      }
    }

    for (const image of service.images) {
      await this.cloudinaryManager.destroy(image.publicId);
    }

    await service.destroy();

    return {
      success: true,
      message: 'Service deleted successfully.',
    } as const;
  }
}
