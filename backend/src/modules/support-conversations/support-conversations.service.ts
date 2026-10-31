import { UserProfileSchema } from "../user-profiles/schemas/user-profile.schema";
import { UserRole } from "../users/schemas/enums/users.enum";
import { UserSchema } from "../users/schemas/user.schema";
import { SupportConversationStatus } from "./schemas/enums/support-coversation.enum";
import type { SupportConversationSchema } from "./schemas/support-conversation.schema";

export class SupportConversationsService {
  constructor(
    private readonly supportConversationSchema: typeof SupportConversationSchema,
    private readonly userSchema: typeof UserSchema,
  ) {}

  async create(userId: string) {
    const existingConversation = await this.supportConversationSchema.findOne({
      where: {
        userId,
        status: SupportConversationStatus.OPEN,
      },
    });

    if (existingConversation) {
      return {
        error: true,
        statusCode: 400,
        message: "You already have an open support conversation",
      } as const;
    }

    // Make sure the user exists
    const user = await this.userSchema.findByPk(userId);

    if (!user) {
      return {
        error: true,
        statusCode: 404,
        message: "User not found",
      } as const;
    }

    const conversation = await this.supportConversationSchema.create({
      userId,
      status: SupportConversationStatus.OPEN,
    });

    return { conversation } as const;
  }

  async findAll(page = 1, limit = 10, offset = (page - 1) * limit) {
    const { rows: conversations, count: total } =
      await this.supportConversationSchema.findAndCountAll({
        include: [
          {
            model: UserSchema,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email"],
            include: [
              {
                model: UserProfileSchema,
                as: "profile",
                attributes: ["avatar"],
              },
            ],
          },
          {
            model: UserSchema,
            as: "lastMessageSender",
            attributes: ["id", "firstName", "lastName"],
          },
          {
            model: UserSchema,
            as: "closedByUser",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
        order: [["updatedAt", "DESC"]],
        limit,
        offset,
      });

    return { conversations, total } as const;
  }

  async findMe(userId: string) {
    const conversations = await this.supportConversationSchema.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: UserSchema,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
          include: [
            {
              model: UserProfileSchema,
              as: "profile",
              attributes: ["avatar"],
            },
          ],
        },
        {
          model: UserSchema,
          as: "lastMessageSender",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    return { conversations };
  }

  async findOne(userId: string, conversationId: string) {
    const currentUser = await this.userSchema.findByPk(userId);

    if (!currentUser) {
      return {
        error: true,
        message: "User not found",
      } as const;
    }

    const isStaff =
      currentUser.role === UserRole.ADMIN ||
      currentUser.role === UserRole.SUPPORT;

    const conversation = await this.supportConversationSchema.findOne({
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
          model: UserSchema,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
          include: [
            {
              model: UserProfileSchema,
              as: "profile",
              attributes: ["avatar"],
            },
          ],
        },
        {
          model: UserSchema,
          as: "lastMessageSender",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: UserSchema,
          as: "closedByUser",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    if (!conversation) {
      return {
        error: true,
        message: "Conversation not found",
      } as const;
    }

    return { conversation } as const;
  }
  async toggle(adminId: string, conversationId: string) {
    const conversation =
      await this.supportConversationSchema.findByPk(conversationId);

    if (!conversation) {
      return {
        error: true,
        message: "Conversation not found",
      } as const;
    }

    if (conversation.status === SupportConversationStatus.OPEN) {
      conversation.status = SupportConversationStatus.CLOSED;
      conversation.closedAt = new Date();
      conversation.closedBy = adminId;

      await conversation.save();

      return {
        success: true,
        message: "Support conversation closed successfully",
        data: conversation,
      } as const;
    }

    conversation.status = SupportConversationStatus.OPEN;
    conversation.closedAt = null;
    conversation.closedBy = null;

    await conversation.save();

    return {
      success: true,
      message: "Support conversation opened successfully",
      data: conversation,
    } as const;
  }
}
