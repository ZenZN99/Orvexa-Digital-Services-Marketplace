import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Message } from './schema/message.schema.js';
import { Contract } from '../contracts/schema/contract.schema.js';
import { User } from '../users/schema/user.schema.js';
import { ContractStatus } from '../../common/enums/contract.enum.js';
import { messages } from '../../common/libs/messages.js';
import { response } from '../../common/libs/response.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { CloudinaryService } from '../../infrastructure/cloudinary/cloudinary.service.js';
import { assertOwnerOrAdmin } from '../../common/libs/assert-owner-or-admin.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { NotificationService } from '../notifications/notification.service.js';
import { NotificationType } from '../../common/enums/notification.enum.js';
import { MessageGateway } from '../../infrastructure/gateways/message.gateway.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message)
    private readonly messageModel: typeof Message,

    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,

    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationService: NotificationService,
    private readonly messageGateway: MessageGateway,
  ) {}

  async create(
    userId: string,
    contractId: string,
    content: string | null,
    images: Express.Multer.File[] = [],
  ) {
    const contract = await this.contractModel.findOne({
      where: {
        id: contractId,
        [Op.or]: [{ clientId: userId }, { '$freelancer.userId$': userId }],
      },
      include: [
        {
          model: Freelancer,
          attributes: ['id', 'userId'],
        },
      ],
    });

    if (!contract) {
      throw new NotFoundException(messages.contract.notFound);
    }

    if (contract.status !== ContractStatus.IN_PROGRESS) {
      throw new BadRequestException(messages.message.contractClosed);
    }

    if (!content?.trim() && images.length === 0) {
      throw new BadRequestException(messages.message.empty);
    }

    const uploadedImages: {
      url: string;
      publicId: string;
    }[] = [];

    // Upload images first
    for (const image of images) {
      const uploadedImage = await this.cloudinaryService.upload(
        image,
        'messages',
      );

      uploadedImages.push({
        url: uploadedImage.url,
        publicId: uploadedImage.publicId,
      });
    }

    // Create message once
    const message = await this.messageModel.create({
      contractId,
      senderId: userId,
      content: content?.trim() || null,
      images: uploadedImages,
    });

    const receiverId =
      contract.clientId === userId
        ? contract.freelancer.userId
        : contract.clientId;

    await this.notificationService.create({
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

    return response(message, messages.message.create.success);
  }

  async findAll(page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const { rows: messages, count: total } =
      await this.messageModel.findAndCountAll({
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
            include: [
              {
                model: UserProfile,
                as: 'profile',
                attributes: ['avatar'],
              },
            ],
          },
          {
            model: Contract,
            attributes: ['id', 'orderId', 'clientId', 'freelancerId', 'status'],
            include: [
              {
                model: User,
                as: 'client',
                attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
                include: [
                  {
                    model: UserProfile,
                    as: 'profile',
                    attributes: ['avatar'],
                  },
                ],
              },
              {
                model: Freelancer,
                attributes: ['id', 'userId'],
                include: [
                  {
                    model: User,
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
                        model: UserProfile,
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

    const totalPages = Math.ceil(total / limit);

    return response(
      {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      null,
    );
  }

  async findMe(userId: string, contractId: string) {
    const contract = await this.contractModel.findOne({
      where: {
        id: contractId,
        [Op.or]: [{ clientId: userId }, { '$freelancer.userId$': userId }],
      },
      include: [
        {
          model: Freelancer,
          attributes: ['id', 'userId'],
        },
      ],
    });

    if (!contract) {
      throw new NotFoundException(messages.contract.notFound);
    }

    const messagesContract = await this.messageModel.findAll({
      where: {
        contractId,
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    return response(messagesContract, null);
  }

  async destroy(currentUser: User, messageId: string) {
    const message = await this.messageModel.findOne({
      where: {
        id: messageId,
      },
      include: [
        {
          model: Contract,
          attributes: ['id', 'status', 'clientId', 'freelancerId'],
          include: [
            {
              model: Freelancer,
              attributes: ['id', 'userId'],
            },
          ],
        },
        {
          model: User,
          as: 'sender',
          attributes: ['id'],
        },
      ],
    });

    if (!message) {
      throw new NotFoundException(messages.message.notFound);
    }

    if (currentUser.role !== UserRole.ADMIN) {
      assertOwnerOrAdmin({
        ownerId: message.sender.id,
        currentUser,
        message: messages.message.forbidden,
      });

      if (message.contract.status !== ContractStatus.IN_PROGRESS) {
        throw new BadRequestException(messages.message.contractClosed);
      }
    }

    const receiverId =
      message.contract.clientId === message.sender.id
        ? message.contract.freelancer.userId
        : message.contract.clientId;

    for (const image of message.images) {
      await this.cloudinaryService.destroy(image.publicId);
    }

    await message.destroy();

    this.messageGateway.sendMessageDeleted({
      receiverId,
      messageId: message.id,
    });

    return response(message, messages.message.destroy.success);
  }
}
