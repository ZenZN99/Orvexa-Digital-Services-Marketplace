import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { SupportConversation } from './schema/support-conversation.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { SupportConversationStatus } from '../../../common/enums/support-conversation.enum.js';
import { messages } from '../../../common/libs/messages.js';
import { response } from '../../../common/libs/response.js';
import { UserProfile } from '../../profiles/user-profiles/schema/user-profile.schema.js';
import { UserRole } from '../../../common/enums/user.enum.js';

@Injectable()
export class SupportConversationService {
  constructor(
    @InjectModel(SupportConversation)
    private readonly supportConversationModel: typeof SupportConversation,

    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(userId: string) {
    // Check if the user already has an open conversation
    const existingConversation = await this.supportConversationModel.findOne({
      where: {
        userId,
        status: SupportConversationStatus.OPEN,
      },
    });

    if (existingConversation) {
      throw new BadRequestException(messages.supportConversation.alreadyOpen);
    }

    // Make sure the user exists
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(messages.user.notFound);
    }

    const conversation = await this.supportConversationModel.create({
      userId,
      status: SupportConversationStatus.OPEN,
    });

    return response(conversation, messages.supportConversation.create.success);
  }

  async findMe(userId: string) {
    const conversations = await this.supportConversationModel.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
        {
          model: User,
          as: 'lastMessageSender',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    return response(conversations, null);
  }

  async findOne(userId: string, conversationId: string) {
    const currentUser = await this.userModel.findByPk(userId);

    if (!currentUser) {
      throw new NotFoundException(messages.user.notFound);
    }

    const isStaff =
      currentUser.role === UserRole.ADMIN ||
      currentUser.role === UserRole.SUPPORT;

    const conversation = await this.supportConversationModel.findOne({
      where: isStaff
        ? {
            id: conversationId,
          }
        : {
            id: conversationId,
            userId,
          },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          include: [
            {
              model: UserProfile,
              as: 'profile',
              attributes: ['avatar'],
            },
          ],
        },
        {
          model: User,
          as: 'lastMessageSender',
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: User,
          as: 'closedByUser',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    if (!conversation) {
      throw new NotFoundException(messages.supportConversation.notFound);
    }

    return response(conversation, null);
  }

  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows: conversations, count: total } =
      await this.supportConversationModel.findAndCountAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            include: [
              {
                model: UserProfile,
                as: 'profile',
                attributes: ['avatar'],
              },
            ],
          },
          {
            model: User,
            as: 'lastMessageSender',
            attributes: ['id', 'firstName', 'lastName'],
          },
          {
            model: User,
            as: 'closedByUser',
            attributes: ['id', 'firstName', 'lastName'],
          },
        ],
        order: [['updatedAt', 'DESC']],
        limit,
        offset,
      });

    const totalPages = Math.ceil(total / limit);

    return response(
      {
        conversations,
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

  async toggle(adminId: string, conversationId: string) {
    const conversation =
      await this.supportConversationModel.findByPk(conversationId);

    if (!conversation) {
      throw new NotFoundException(messages.supportConversation.notFound);
    }

    if (conversation.status === SupportConversationStatus.OPEN) {
      conversation.status = SupportConversationStatus.CLOSED;
      conversation.closedAt = new Date();
      conversation.closedBy = adminId;

      await conversation.save();

      return response(conversation, messages.supportConversation.close.success);
    }

    conversation.status = SupportConversationStatus.OPEN;
    conversation.closedAt = null;
    conversation.closedBy = null;

    await conversation.save();

    return response(conversation, messages.supportConversation.open.success);
  }
}
