import { Validator } from 'riser-bob';
import type { CloudinaryManager } from '../../config/cloudinary/cloudinary';
import { ContractSchema } from '../contracts/schemas/contract.schema';
import { CreateMessageRule } from './rules/create';
import type { MessageSchema } from './schemas/message.schema';
import { ContractStatus } from '../contracts/schemas/enums/contract.enum';
import { FreelancerSchema } from '../freelancers/schemas/freelancer.schema';
import { Op } from 'sequelize';
import { buildPagination } from '../../utilities/pagination';
import { UserProfileSchema } from '../user-profiles/schemas/user-profile.schema';
import {
  UserSchema,
  type AuthenticationUser,
} from '../users/schemas/user.schema';
import { UserRole } from '../users/schemas/enums/users.enum';
import type { MessageGateway } from '../../config/gateways/message.gateway';
import { NotificationType } from '../notifications/schemas/enums/notification.enum';
import type { NotificationsService } from '../notifications/notifications.service';

export class MessagesService {
  constructor(
    private readonly messageSchema: typeof MessageSchema,
    private readonly contractSchema: typeof ContractSchema,
    private readonly cloudinaryManager: CloudinaryManager,
    private readonly notificationsService: NotificationsService,
    private readonly messageGateway: MessageGateway,
  ) {}

  async create(
    userId: string,
    contractId: string,
    formData: {
      get(name: string): string | File | null;
      getAll(name: string): (string | File)[];
    },
  ) {
    const contract = await this.contractSchema.findOne({
      where: {
        id: contractId,
        [Op.or]: [{ clientId: userId }, { '$freelancer.userId$': userId }],
      },
      include: [
        {
          model: FreelancerSchema,
          as: 'freelancer',
          attributes: ['id', 'userId'],
        },
      ],
    });

    if (!contract) {
      return {
        error: true,
        statusCode: 404,
        message: 'Contract not found.',
      } as const;
    }

    if (contract.status !== ContractStatus.IN_PROGRESS) {
      return {
        error: true,
        statusCode: 400,
        message: 'Cannot send messages in a closed contract.',
      } as const;
    }

    const contentValue = formData.get('content');
    const content = typeof contentValue === 'string' ? contentValue : null;

    const validation = Validator.validate(
      { content: content?.trim() || null },
      CreateMessageRule,
    );

    if (!validation.valid) {
      return {
        error: true,
        statusCode: 422,
        message: 'Validation failed.',
        errors: validation.errors,
      } as const;
    }

    const MAX_FILES = 5;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const imageFiles = formData
      .getAll('images')
      .filter((value) => value instanceof File && value.size > 0) as File[];

    if (imageFiles.length > MAX_FILES) {
      return {
        error: true,
        statusCode: 400,
        message: `You can upload a maximum of ${MAX_FILES} images.`,
      } as const;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    for (const image of imageFiles) {
      if (image.size > MAX_FILE_SIZE) {
        return {
          error: true,
          statusCode: 400,
          message: 'Each image must be 5 MB or smaller.',
        } as const;
      }

      if (!allowedTypes.includes(image.type)) {
        return {
          error: true,
          statusCode: 400,
          message: 'Only JPEG, PNG, and WebP images are allowed.',
        } as const;
      }
    }

    if (!content && imageFiles.length === 0) {
      return {
        error: true,
        statusCode: 400,
        message: 'A message must contain text or at least one image.',
      } as const;
    }

    const uploadedImages: {
      url: string;
      publicId: string;
    }[] = [];

    for (const image of imageFiles) {
      const uploadedImage = await this.cloudinaryManager.upload(
        image,
        'messages',
      );

      uploadedImages.push({
        url: uploadedImage.url,
        publicId: uploadedImage.publicId,
      });
    }

    const receiverId =
      contract.clientId === userId
        ? contract.freelancer.userId
        : contract.clientId;

    const message = await this.messageSchema.create({
      contractId,
      senderId: userId,
      content: content || null,
      images: uploadedImages,
    });

    await this.notificationsService.create({
      senderId: userId,
      receiverId,
      targetId: message.id,
      type: NotificationType.CONTRACT_MESSAGE,
      message: 'You have a new message.',
      link: `/contract/${contractId}`,
    });

    this.messageGateway.sendMessage({
      receiverId,
      message,
    });

    return {
      success: true,
      message: 'Message created successfully.',
      data: message,
    } as const;
  }

  async findAll(page = 1, limit = 10, offset = (page - 1) * limit) {
    const { rows: messages, count: total } =
      await this.messageSchema.findAndCountAll({
        include: [
          {
            model: UserSchema,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            include: [
              {
                model: UserProfileSchema,
                as: 'profile',
                attributes: ['avatar'],
              },
            ],
          },
          {
            model: ContractSchema,
            attributes: ['id', 'orderId', 'clientId', 'freelancerId', 'status'],
            include: [
              {
                model: UserProfileSchema,
                as: 'client',
                attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                include: [
                  {
                    model: UserProfileSchema,
                    as: 'profile',
                    attributes: ['avatar'],
                  },
                ],
              },
              {
                model: FreelancerSchema,
                attributes: ['id', 'userId'],
                include: [
                  {
                    model: UserProfileSchema,
                    as: 'user',
                    attributes: [
                      'id',
                      'firstName',
                      'lastName',
                      'email',
                      'role',
                    ],
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
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

    return {
      success: true,
      data: messages,
      pagination: buildPagination(page, total, limit),
    } as const;
  }

  async findMe(userId: string, contractId: string) {
    const contract = await this.contractSchema.findOne({
      where: {
        id: contractId,
        [Op.or]: [{ clientId: userId }, { '$freelancer.userId$': userId }],
      },
      include: [
        {
          model: FreelancerSchema,
          as: 'freelancer',
          attributes: ['id', 'userId'],
        },
      ],
    });

    if (!contract) {
      return {
        error: true,
        message: 'Contract not found',
      } as const;
    }

    const messagesContract = await this.messageSchema.findAll({
      where: {
        contractId,
      },
      include: [
        {
          model: UserSchema,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [
            {
              model: UserProfileSchema,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    return {
      success: true,
      data: messagesContract,
    } as const;
  }

  async delete(currentUser: AuthenticationUser, messageId: string) {
    const message = await this.messageSchema.findOne({
      where: {
        id: messageId,
      },
      include: [
        {
          model: ContractSchema,
          as: 'contract',
          attributes: ['id', 'status', 'clientId', 'freelancerId'],
          include: [
            {
              model: FreelancerSchema,
              as: 'freelancer',
              attributes: ['id', 'userId'],
            },
          ],
        },
        {
          model: UserSchema,
          as: 'sender',
          attributes: ['id'],
        },
      ],
    });

    if (!message) {
      return {
        error: true,
        statusCode: 404,
        message: 'Message not found',
      } as const;
    }

    if (currentUser?.role !== UserRole.ADMIN) {
      const isOwner = message.sender.id === currentUser?.id;

      if (!isOwner) {
        return {
          error: true,
          statusCode: 403,
          message: 'You are not allowed to perform this action',
        } as const;
      }

      if (message.contract.status !== ContractStatus.IN_PROGRESS) {
        return {
          error: true,
          statusCode: 400,
          message:
            'Messages can only be managed while the contract is in progress',
        } as const;
      }
    }

    const receiverId =
      message.contract.clientId === message.sender.id
        ? message.contract.freelancer.userId
        : message.contract.clientId;

    for (const image of message.images) {
      await this.cloudinaryManager.destroy(image.publicId);
    }

    await message.destroy();

    this.messageGateway.sendMessageDeleted({
      receiverId,
      messageId: message.id,
    });

    return {
      success: true,
      message: 'Message deleted successfully',
    } as const;
  }
}
