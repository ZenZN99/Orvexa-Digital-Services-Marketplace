import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SupportMessage } from './schema/support-message.schema.js';
import { SupportConversation } from '../coversations/schema/support-conversation.schema.js';
import { messages } from '../../../common/libs/messages.js';
import { SupportConversationStatus } from '../../../common/enums/support-conversation.enum.js';
import { response } from '../../../common/libs/response.js';
import { User } from '../../users/schema/user.schema.js';
import { CloudinaryService } from '../../../infrastructure/cloudinary/cloudinary.service.js';
import { UserRole } from '../../../common/enums/user.enum.js';
import { UserProfile } from '../../profiles/user-profiles/schema/user-profile.schema.js';

@Injectable()
export class SupportMessageService {
  constructor(
    @InjectModel(SupportMessage)
    private readonly supportMessageModel: typeof SupportMessage,

    @InjectModel(SupportConversation)
    private readonly supportConversationModel: typeof SupportConversation,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private authorizeConversation(
    conversation: SupportConversation,
    currentUser: User,
  ) {
    const isStaff =
      currentUser.role === UserRole.ADMIN ||
      currentUser.role === UserRole.SUPPORT;

    if (!isStaff && conversation.userId !== currentUser.id) {
      throw new NotFoundException(messages.supportConversation.notFound);
    }
  }

  async create(
    currentUser: User,
    conversationId: string,
    message: string | null,
    files: Express.Multer.File[] = [],
  ) {
    const conversation =
      await this.supportConversationModel.findByPk(conversationId);

    if (!conversation) {
      throw new NotFoundException(messages.supportConversation.notFound);
    }

    this.authorizeConversation(conversation, currentUser);

    if (conversation.status !== SupportConversationStatus.OPEN) {
      throw new BadRequestException(messages.supportConversation.closed);
    }

    if (files.length > 5) {
      throw new BadRequestException(
        messages.supportMessage.create.maxAttachments,
      );
    }

    if (!message?.trim() && files.length === 0) {
      throw new BadRequestException(messages.supportMessage.create.empty);
    }

    const attachments = [];

    for (const file of files) {
      const uploaded = await this.cloudinaryService.upload(
        file,
        'support-messages/attachments',
      );

      attachments.push(uploaded.url);
    }

    const supportMessage = await this.supportMessageModel.create({
      conversationId,
      senderId: currentUser.id,
      message: message?.trim() || null,
      attachments,
    });

    conversation.lastMessage = message?.trim() || 'Attachment';

    conversation.lastMessageSenderId = currentUser.id;

    await conversation.save();

    const fullMessage = await this.supportMessageModel.findByPk(
      supportMessage.id,
      {
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['id', 'firstName', 'lastName', 'role'],
            include: [
              { model: UserProfile, as: 'profile', attributes: ['avatar'] },
            ],
          },
        ],
      },
    );

    return response(fullMessage, messages.supportMessage.create.success);
  }

  async findAll(currentUser: User, conversationId: string) {
    const conversation =
      await this.supportConversationModel.findByPk(conversationId);

    if (!conversation) {
      throw new NotFoundException(messages.supportConversation.notFound);
    }

    this.authorizeConversation(conversation, currentUser);

    const supportMessages = await this.supportMessageModel.findAll({
      where: {
        conversationId,
      },
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
      ],
      order: [['createdAt', 'ASC']],
    });

    return response(supportMessages, null);
  }

  async markAllAsRead(currentUser: User, conversationId: string) {
    const conversation =
      await this.supportConversationModel.findByPk(conversationId);

    if (!conversation) {
      throw new NotFoundException(messages.supportConversation.notFound);
    }

    this.authorizeConversation(conversation, currentUser);

    const updatedmessages = await this.supportMessageModel.update(
      {
        isRead: true,
      },
      {
        where: {
          conversationId,
          isRead: false,
        },
      },
    );

    return response(
      updatedmessages,
      messages.supportMessage.markAsRead.success,
    );
  }

  async destroy(conversationId: string, messageId: string) {
    const supportMessage = await this.supportMessageModel.findOne({
      where: {
        id: messageId,
        conversationId,
      },
    });

    if (!supportMessage) {
      throw new NotFoundException(messages.supportMessage.notFound);
    }

    for (const attachment of supportMessage.attachments) {
      await this.cloudinaryService.destroy(attachment);
    }

    await supportMessage.destroy();

    return response(null, messages.supportMessage.destroy.success);
  }
}
