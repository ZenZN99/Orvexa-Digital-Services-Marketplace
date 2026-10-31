import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test";
import type { CloudinaryManager } from "../../../config/cloudinary/cloudinary";
import { SupportConversationStatus } from "../../support-conversations/schemas/enums/support-coversation.enum";
import type { SupportConversationSchema } from "../../support-conversations/schemas/support-conversation.schema";
import { UserRole } from "../../users/schemas/enums/users.enum";
import type { AuthenticationUser } from "../../users/schemas/user.schema";
import type { SupportMessageSchema } from "../schemas/support-message.schema";
import { SupportMessagesService } from "../support-messages.service";

// ───────────────────────── types ─────────────────────────

interface FakeConversation {
  id: string;
  userId: string;
  status: SupportConversationStatus;
  lastMessage: string | null;
  lastMessageSenderId: string | null;
  save: Mock<() => Promise<void>>;
}

interface FakeMessage {
  id: string;
  attachments: string[];
  destroy: Mock<() => Promise<void>>;
}

interface FakeSupportMessageSchema {
  create: Mock<(data: unknown) => Promise<{ id: string }>>;
  findByPk: Mock<(id: string, options?: unknown) => Promise<unknown>>;
  findAll: Mock<(options: unknown) => Promise<unknown[]>>;
  findOne: Mock<(options: unknown) => Promise<FakeMessage | null>>;
  update: Mock<(values: unknown, options: unknown) => Promise<[number]>>;
}

interface FakeSupportConversationSchema {
  findByPk: Mock<(id: string) => Promise<FakeConversation | null>>;
}

interface FakeCloudinaryManager {
  upload: Mock<
    (file: File, folder: string) => Promise<{ url: string; publicId: string }>
  >;
  destroy: Mock<(publicId: string) => Promise<void>>;
}

// ───────────────────────── helpers ─────────────────────────

const ownerId = "user-1";
const conversationId = "conversation-1";
const messageId = "message-1";

const memberRole = Object.values(UserRole).find(
  (role) => role !== UserRole.ADMIN && role !== UserRole.SUPPORT,
) as UserRole;

const makeUser = (role: UserRole, id = ownerId): AuthenticationUser =>
  ({ id, role }) as unknown as AuthenticationUser;

const owner = makeUser(memberRole);

const makeConversation = (
  overrides: Partial<FakeConversation> = {},
): FakeConversation => ({
  id: conversationId,
  userId: ownerId,
  status: SupportConversationStatus.OPEN,
  lastMessage: null,
  lastMessageSenderId: null,
  save: mock(async (): Promise<void> => {}),
  ...overrides,
});

const makeFile = (name: string, content = "x") =>
  new File([content], name, { type: "image/png" });

const makeFormData = (
  message: string | null = "Hello",
  attachments: (File | string)[] = [],
) => {
  const formData = new FormData();

  if (message !== null) {
    formData.append("message", message);
  }
  for (const attachment of attachments) {
    formData.append("attachments", attachment);
  }

  return formData;
};

// Compare results without fighting the service's narrow `as const` return types.
const plain = (value: unknown): unknown => value;

// ───────────────────────── tests ─────────────────────────

describe("SupportMessagesService", () => {
  let supportMessageSchema: FakeSupportMessageSchema;
  let supportConversationSchema: FakeSupportConversationSchema;
  let cloudinaryManager: FakeCloudinaryManager;
  let service: SupportMessagesService;

  beforeEach(() => {
    supportMessageSchema = {
      create: mock(
        async (_data: unknown): Promise<{ id: string }> => ({
          id: messageId,
        }),
      ),
      findByPk: mock(
        async (_id: string, _options?: unknown): Promise<unknown> => null,
      ),
      findAll: mock(async (_options: unknown): Promise<unknown[]> => []),
      findOne: mock(
        async (_options: unknown): Promise<FakeMessage | null> => null,
      ),
      update: mock(
        async (_values: unknown, _options: unknown): Promise<[number]> => [0],
      ),
    };
    supportConversationSchema = {
      findByPk: mock(
        async (_id: string): Promise<FakeConversation | null> => null,
      ),
    };
    cloudinaryManager = {
      upload: mock(
        async (
          file: File,
          _folder: string,
        ): Promise<{ url: string; publicId: string }> => ({
          url: `https://cdn.test/${file.name}`,
          publicId: `public-${file.name}`,
        }),
      ),
      destroy: mock(async (_publicId: string): Promise<void> => {}),
    };

    service = new SupportMessagesService(
      supportMessageSchema as unknown as typeof SupportMessageSchema,
      supportConversationSchema as unknown as typeof SupportConversationSchema,
      cloudinaryManager as unknown as CloudinaryManager,
    );
  });

  // ───────────────────────── create ─────────────────────────
  describe("create", () => {
    // The user owns an open conversation; each test breaks one thing.
    let conversation: FakeConversation;

    beforeEach(() => {
      conversation = makeConversation();
      supportConversationSchema.findByPk.mockResolvedValue(conversation);
    });

    it("returns 404 when the conversation doesn't exist", async () => {
      supportConversationSchema.findByPk.mockResolvedValue(null);

      const result = await service.create(
        owner,
        conversationId,
        makeFormData(),
      );

      expect(supportConversationSchema.findByPk).toHaveBeenCalledWith(
        conversationId,
      );
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: "Support conversation not found",
      });
    });

    it("returns 404 when a regular user isn't the conversation's owner", async () => {
      const result = await service.create(
        makeUser(memberRole, "someone-else"),
        conversationId,
        makeFormData(),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: "Support conversation not found",
      });
      expect(supportMessageSchema.create).not.toHaveBeenCalled();
    });

    for (const role of [UserRole.ADMIN, UserRole.SUPPORT]) {
      it(`lets a ${role} user write in any conversation`, async () => {
        const result = await service.create(
          makeUser(role, "staff-1"),
          conversationId,
          makeFormData(),
        );

        expect(plain(result)).toMatchObject({ success: true });
        expect(supportMessageSchema.create).toHaveBeenCalledWith(
          expect.objectContaining({ senderId: "staff-1" }),
        );
      });
    }

    it("returns 400 when the conversation is closed", async () => {
      supportConversationSchema.findByPk.mockResolvedValue(
        makeConversation({ status: SupportConversationStatus.CLOSED }),
      );

      const result = await service.create(
        owner,
        conversationId,
        makeFormData(),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: "Cannot send messages to a closed support conversation",
      });
      expect(supportMessageSchema.create).not.toHaveBeenCalled();
    });

    it("returns 400 when more than 5 files are attached", async () => {
      const files = Array.from({ length: 6 }, (_, index) =>
        makeFile(`file-${index}.png`),
      );

      const result = await service.create(
        owner,
        conversationId,
        makeFormData("Hello", files),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: "You can attach a maximum of 5 files",
      });
      expect(cloudinaryManager.upload).not.toHaveBeenCalled();
    });

    it("returns 400 when there is neither a message nor an attachment", async () => {
      const result = await service.create(
        owner,
        conversationId,
        makeFormData(null),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: "Message content or at least one attachment is required",
      });
      expect(supportMessageSchema.create).not.toHaveBeenCalled();
    });

    it("treats a blank message with only empty files or text values as empty", async () => {
      const result = await service.create(
        owner,
        conversationId,
        makeFormData("   ", [makeFile("empty.png", ""), "not-a-file"]),
      );

      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: "Message content or at least one attachment is required",
      });
      expect(cloudinaryManager.upload).not.toHaveBeenCalled();
    });

    it("uploads every attachment to the support attachments folder", async () => {
      await service.create(
        owner,
        conversationId,
        makeFormData("Hello", [makeFile("a.png"), makeFile("b.png")]),
      );

      expect(cloudinaryManager.upload).toHaveBeenCalledTimes(2);
      expect(cloudinaryManager.upload).toHaveBeenCalledWith(
        expect.objectContaining({ name: "a.png" }),
        "support-messages/attachments",
      );
      expect(cloudinaryManager.upload).toHaveBeenCalledWith(
        expect.objectContaining({ name: "b.png" }),
        "support-messages/attachments",
      );
    });

    it("creates an unread message with the trimmed text and the attachment urls", async () => {
      await service.create(
        owner,
        conversationId,
        makeFormData("  Hello  ", [makeFile("a.png"), makeFile("b.png")]),
      );

      expect(supportMessageSchema.create).toHaveBeenCalledWith({
        conversationId,
        senderId: ownerId,
        message: "Hello",
        attachments: ["https://cdn.test/a.png", "https://cdn.test/b.png"],
        isRead: false,
      });
    });

    it("stores a null message and an Attachment preview when only files are sent", async () => {
      await service.create(
        owner,
        conversationId,
        makeFormData(null, [makeFile("a.png")]),
      );

      expect(supportMessageSchema.create).toHaveBeenCalledWith(
        expect.objectContaining({ message: null }),
      );
      expect(conversation.lastMessage).toBe("Attachment");
    });

    it("updates the conversation's last message and sender", async () => {
      await service.create(owner, conversationId, makeFormData("  Hello  "));

      expect(conversation.lastMessage).toBe("Hello");
      expect(conversation.lastMessageSenderId).toBe(ownerId);
      expect(conversation.save).toHaveBeenCalledTimes(1);
    });

    it("returns the created message loaded with its sender", async () => {
      const fullMessage = { id: messageId, message: "Hello" };
      supportMessageSchema.findByPk.mockResolvedValue(fullMessage);

      const result = await service.create(
        owner,
        conversationId,
        makeFormData(),
      );

      expect(supportMessageSchema.findByPk).toHaveBeenCalledWith(
        messageId,
        expect.objectContaining({
          include: [
            expect.objectContaining({
              as: "sender",
              attributes: ["id", "firstName", "lastName", "role"],
            }),
          ],
        }),
      );
      expect(plain(result)).toEqual({
        success: true,
        message: "Support message created successfully",
        data: fullMessage,
      });
    });

    it.todo(
      "deletes the uploaded attachments when creating the message or saving the conversation fails (they are left on Cloudinary today)",
    );
  });

  // ───────────────────────── findAll / markAllAsRead ─────────────────────────
  for (const method of ["findAll", "markAllAsRead"] as const) {
    describe(`${method} access`, () => {
      it("returns an error when the conversation doesn't exist", async () => {
        supportConversationSchema.findByPk.mockResolvedValue(null);

        const result = await service[method](owner, conversationId);

        expect(supportConversationSchema.findByPk).toHaveBeenCalledWith(
          conversationId,
        );
        expect(plain(result)).toEqual({
          error: true,
          message: "Support conversation not found",
        });
      });

      it("returns the same error when a regular user isn't the owner", async () => {
        supportConversationSchema.findByPk.mockResolvedValue(
          makeConversation(),
        );

        const result = await service[method](
          makeUser(memberRole, "someone-else"),
          conversationId,
        );

        expect(plain(result)).toEqual({
          error: true,
          message: "Support conversation not found",
        });
        expect(supportMessageSchema.findAll).not.toHaveBeenCalled();
        expect(supportMessageSchema.update).not.toHaveBeenCalled();
      });

      for (const role of [UserRole.ADMIN, UserRole.SUPPORT]) {
        it(`lets a ${role} user access any conversation`, async () => {
          supportConversationSchema.findByPk.mockResolvedValue(
            makeConversation(),
          );

          const result = await service[method](
            makeUser(role, "staff-1"),
            conversationId,
          );

          expect(plain(result)).toMatchObject({ success: true });
        });
      }
    });
  }

  // ───────────────────────── findAll ─────────────────────────
  describe("findAll", () => {
    it("returns the conversation's messages with their sender, oldest first", async () => {
      const messages = [{ id: "m1" }, { id: "m2" }];
      supportConversationSchema.findByPk.mockResolvedValue(makeConversation());
      supportMessageSchema.findAll.mockResolvedValue(messages);

      const result = await service.findAll(owner, conversationId);

      expect(supportMessageSchema.findAll).toHaveBeenCalledWith({
        where: { conversationId },
        include: [
          expect.objectContaining({
            as: "sender",
            attributes: ["id", "firstName", "lastName", "email", "role"],
          }),
        ],
        order: [["createdAt", "ASC"]],
      });
      expect(plain(result)).toEqual({ success: true, data: messages });
    });
  });

  // ───────────────────────── markAllAsRead ─────────────────────────
  describe("markAllAsRead", () => {
    it("marks every unread message of the conversation as read", async () => {
      supportConversationSchema.findByPk.mockResolvedValue(makeConversation());
      supportMessageSchema.update.mockResolvedValue([3]);

      const result = await service.markAllAsRead(owner, conversationId);

      expect(supportMessageSchema.update).toHaveBeenCalledWith(
        { isRead: true },
        { where: { conversationId, isRead: false } },
      );
      expect(plain(result)).toEqual({
        success: true,
        message: "All support messages marked as read successfully",
        data: [3],
      });
    });
  });

  // ───────────────────────── delete ─────────────────────────
  describe("delete", () => {
    it("returns an error when the message isn't in the conversation", async () => {
      supportMessageSchema.findOne.mockResolvedValue(null);

      const result = await service.delete(conversationId, messageId);

      expect(supportMessageSchema.findOne).toHaveBeenCalledWith({
        where: { id: messageId, conversationId },
      });
      expect(plain(result)).toEqual({
        error: true,
        message: "Support message not found",
      });
    });

    it("deletes the attachments and the message", async () => {
      const message: FakeMessage = {
        id: messageId,
        attachments: ["https://cdn.test/a.png", "https://cdn.test/b.png"],
        destroy: mock(async (): Promise<void> => {}),
      };
      supportMessageSchema.findOne.mockResolvedValue(message);

      const result = await service.delete(conversationId, messageId);

      expect(cloudinaryManager.destroy).toHaveBeenCalledTimes(2);
      expect(message.destroy).toHaveBeenCalledTimes(1);
      expect(plain(result)).toEqual({
        success: true,
        message: "Support message deleted successfully",
      });
    });

    it.todo(
      "destroys the attachments on Cloudinary by their publicId (it passes the stored url, which Cloudinary doesn't accept)",
    );
  });
});
