import type { CloudinaryManager } from "../../config/cloudinary/cloudinary";
import { SupportConversationStatus } from "../support-conversations/schemas/enums/support-coversation.enum";
import type { SupportConversationSchema } from "../support-conversations/schemas/support-conversation.schema";
import { UserProfileSchema } from "../user-profiles/schemas/user-profile.schema";
import { UserRole } from "../users/schemas/enums/users.enum";
import {
  UserSchema,
  type AuthenticationUser,
} from "../users/schemas/user.schema";
import type { SupportMessageSchema } from "./schemas/support-message.schema";

export class SupportMessagesService {
  constructor(
    private readonly supportMessageSchema: typeof SupportMessageSchema,
    private readonly supportConversationSchema: typeof SupportConversationSchema,
    private readonly cloudinaryManager: CloudinaryManager,
  ) {}

  async create(
    currentUser: AuthenticationUser,
    conversationId: string,
    formData: {
      get(name: string): string | File | null;
      getAll(name: string): (string | File)[];
    },
  ) {
    const message = formData.get("message")?.toString();
    const files = formData
      .getAll("attachments")
      .filter((value) => value instanceof File && value.size > 0) as File[];

    const conversation =
      await this.supportConversationSchema.findByPk(conversationId);

    if (!conversation) {
      return {
        error: true,
        statusCode: 404,
        message: "Support conversation not found",
      } as const;
    }

    const isStaff =
      currentUser?.role === UserRole.ADMIN ||
      currentUser?.role === UserRole.SUPPORT;

    if (!isStaff && conversation.userId !== currentUser?.id) {
      return {
        error: true,
        statusCode: 404,
        message: "Support conversation not found",
      } as const;
    }

    if (conversation.status !== SupportConversationStatus.OPEN) {
      return {
        error: true,
        statusCode: 400,
        message: "Cannot send messages to a closed support conversation",
      } as const;
    }

    if (files.length > 5) {
      return {
        error: true,
        statusCode: 400,
        message: "You can attach a maximum of 5 files",
      } as const;
    }

    if (!message?.trim() && files.length === 0) {
      return {
        error: true,
        statusCode: 400,
        message: "Message content or at least one attachment is required",
      } as const;
    }

    const attachments: string[] = [];

    for (const file of files) {
      const uploaded = await this.cloudinaryManager.upload(
        file,
        "support-messages/attachments",
      );

      attachments.push(uploaded.url);
    }

    const supportMessage = await this.supportMessageSchema.create({
      conversationId,
      senderId: currentUser!.id,
      message: message?.trim() || null,
      attachments,
      isRead: false,
    });

    conversation.lastMessage = message?.trim() || "Attachment";
    conversation.lastMessageSenderId = currentUser!.id;

    await conversation.save();

    const fullMessage = await this.supportMessageSchema.findByPk(
      supportMessage.id,
      {
        include: [
          {
            model: UserSchema,
            as: "sender",
            attributes: ["id", "firstName", "lastName", "role"],
            include: [
              {
                model: UserProfileSchema,
                as: "profile",
                attributes: ["avatar"],
              },
            ],
          },
        ],
      },
    );

    return {
      success: true,
      message: "Support message created successfully",
      data: fullMessage,
    } as const;
  }

  async findAll(currentUser: AuthenticationUser, conversationId: string) {
    const conversation =
      await this.supportConversationSchema.findByPk(conversationId);

    if (!conversation) {
      return {
        error: true,
        message: "Support conversation not found",
      } as const;
    }

    const isStaff =
      currentUser?.role === UserRole.ADMIN ||
      currentUser?.role === UserRole.SUPPORT;

    if (!isStaff && conversation.userId !== currentUser?.id) {
      return {
        error: true,
        message: "Support conversation not found",
      } as const;
    }

    const supportMessages = await this.supportMessageSchema.findAll({
      where: {
        conversationId,
      },
      include: [
        {
          model: UserSchema,
          as: "sender",
          attributes: ["id", "firstName", "lastName", "email", "role"],
          include: [
            {
              model: UserProfileSchema,
              as: "profile",
              attributes: ["avatar"],
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return { success: true, data: supportMessages } as const;
  }

  async markAllAsRead(currentUser: AuthenticationUser, conversationId: string) {
    const conversation =
      await this.supportConversationSchema.findByPk(conversationId);

    if (!conversation) {
      return {
        error: true,
        message: "Support conversation not found",
      } as const;
    }

    const isStaff =
      currentUser?.role === UserRole.ADMIN ||
      currentUser?.role === UserRole.SUPPORT;

    if (!isStaff && conversation.userId !== currentUser?.id) {
      return {
        error: true,
        message: "Support conversation not found",
      } as const;
    }

    const updatedMessages = await this.supportMessageSchema.update(
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

    return {
      success: true,
      message: "All support messages marked as read successfully",
      data: updatedMessages,
    } as const;
  }

  async delete(conversationId: string, messageId: string) {
    const supportMessage = await this.supportMessageSchema.findOne({
      where: {
        id: messageId,
        conversationId,
      },
    });

    if (!supportMessage) {
      return {
        error: true,
        message: "Support message not found",
      } as const;
    }

    for (const attachment of supportMessage.attachments) {
      await this.cloudinaryManager.destroy(attachment);
    }

    await supportMessage.destroy();

    return {
      success: true,
      message: "Support message deleted successfully",
    } as const;
  }
}
