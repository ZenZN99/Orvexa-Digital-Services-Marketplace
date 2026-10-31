import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test";
import { UserRole } from "../../users/schemas/enums/users.enum";
import type { UserSchema } from "../../users/schemas/user.schema";
import { SupportConversationStatus } from "../schemas/enums/support-coversation.enum";
import type { SupportConversationSchema } from "../schemas/support-conversation.schema";
import { SupportConversationsService } from "../support-conversations.service";

// ───────────────────────── types ─────────────────────────

interface FakeConversation {
  id: string;
  status: SupportConversationStatus;
  closedAt: Date | null;
  closedBy: string | null;
  save: Mock<() => Promise<void>>;
}

interface FakeSupportConversationSchema {
  findOne: Mock<(options: unknown) => Promise<FakeConversation | null>>;
  findByPk: Mock<(id: string) => Promise<FakeConversation | null>>;
  create: Mock<(data: unknown) => Promise<{ id: string }>>;
  findAndCountAll: Mock<
    (options: unknown) => Promise<{ rows: unknown[]; count: number }>
  >;
  findAll: Mock<(options: unknown) => Promise<unknown[]>>;
}

interface FakeUserSchema {
  findByPk: Mock<
    (id: string) => Promise<{ id: string; role: UserRole } | null>
  >;
}

// ───────────────────────── helpers ─────────────────────────

const userId = "user-1";
const adminId = "admin-1";
const conversationId = "conversation-1";

const makeConversation = (
  overrides: Partial<FakeConversation> = {},
): FakeConversation => ({
  id: conversationId,
  status: SupportConversationStatus.OPEN,
  closedAt: null,
  closedBy: null,
  save: mock(async (): Promise<void> => {}),
  ...overrides,
});

const memberRole = Object.values(UserRole).find(
  (role) => role !== UserRole.ADMIN && role !== UserRole.SUPPORT,
) as UserRole;

// Compare results without fighting the service's narrow `as const` return types.
const plain = (value: unknown): unknown => value;

// ───────────────────────── tests ─────────────────────────

describe("SupportConversationsService", () => {
  let supportConversationSchema: FakeSupportConversationSchema;
  let userSchema: FakeUserSchema;
  let service: SupportConversationsService;

  beforeEach(() => {
    supportConversationSchema = {
      findOne: mock(
        async (_options: unknown): Promise<FakeConversation | null> => null,
      ),
      findByPk: mock(
        async (_id: string): Promise<FakeConversation | null> => null,
      ),
      create: mock(
        async (_data: unknown): Promise<{ id: string }> => ({
          id: conversationId,
        }),
      ),
      findAndCountAll: mock(
        async (
          _options: unknown,
        ): Promise<{ rows: unknown[]; count: number }> => ({
          rows: [],
          count: 0,
        }),
      ),
      findAll: mock(async (_options: unknown): Promise<unknown[]> => []),
    };
    userSchema = {
      findByPk: mock(
        async (_id: string): Promise<{ id: string; role: UserRole } | null> =>
          null,
      ),
    };

    service = new SupportConversationsService(
      supportConversationSchema as unknown as typeof SupportConversationSchema,
      userSchema as unknown as typeof UserSchema,
    );
  });

  // ───────────────────────── create ─────────────────────────
  describe("create", () => {
    it("returns 400 when the user already has an open conversation", async () => {
      supportConversationSchema.findOne.mockResolvedValue(makeConversation());

      const result = await service.create(userId);

      expect(supportConversationSchema.findOne).toHaveBeenCalledWith({
        where: { userId, status: SupportConversationStatus.OPEN },
      });
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 400,
        message: "You already have an open support conversation",
      });
      expect(userSchema.findByPk).not.toHaveBeenCalled();
      expect(supportConversationSchema.create).not.toHaveBeenCalled();
    });

    it("returns 404 when the user doesn't exist", async () => {
      userSchema.findByPk.mockResolvedValue(null);

      const result = await service.create(userId);

      expect(userSchema.findByPk).toHaveBeenCalledWith(userId);
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: "User not found",
      });
      expect(supportConversationSchema.create).not.toHaveBeenCalled();
    });

    it("creates an open conversation for the user and returns it", async () => {
      const conversation = { id: "created-conversation" };
      userSchema.findByPk.mockResolvedValue({ id: userId, role: memberRole });
      supportConversationSchema.create.mockResolvedValue(conversation);

      const result = await service.create(userId);

      expect(supportConversationSchema.create).toHaveBeenCalledWith({
        userId,
        status: SupportConversationStatus.OPEN,
      });
      expect(plain(result)).toEqual({ conversation });
    });
  });

  // ───────────────────────── findAll ─────────────────────────
  describe("findAll", () => {
    it("uses the default page and limit when none are given", async () => {
      await service.findAll();

      expect(supportConversationSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [["updatedAt", "DESC"]],
          limit: 10,
          offset: 0,
        }),
      );
    });

    it("derives the offset from the page and limit", async () => {
      await service.findAll(3, 5);

      expect(supportConversationSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 5, offset: 10 }),
      );
    });

    it("includes the user, the last message sender and the user who closed it", async () => {
      await service.findAll();

      expect(supportConversationSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: [
            expect.objectContaining({
              as: "user",
              attributes: ["id", "firstName", "lastName", "email"],
            }),
            expect.objectContaining({
              as: "lastMessageSender",
              attributes: ["id", "firstName", "lastName"],
            }),
            expect.objectContaining({
              as: "closedByUser",
              attributes: ["id", "firstName", "lastName"],
            }),
          ],
        }),
      );
    });

    it("returns the conversations with the total", async () => {
      const rows = [{ id: "c1" }, { id: "c2" }];
      supportConversationSchema.findAndCountAll.mockResolvedValue({
        rows,
        count: 12,
      });

      const result = await service.findAll(2, 5);

      expect(plain(result)).toEqual({ conversations: rows, total: 12 });
    });
  });

  // ───────────────────────── findMe ─────────────────────────
  describe("findMe", () => {
    it("returns the user's conversations, most recently updated first", async () => {
      const conversations = [{ id: "c1" }, { id: "c2" }];
      supportConversationSchema.findAll.mockResolvedValue(conversations);

      const result = await service.findMe(userId);

      expect(supportConversationSchema.findAll).toHaveBeenCalledWith({
        where: { userId },
        include: [
          expect.objectContaining({ as: "user" }),
          expect.objectContaining({ as: "lastMessageSender" }),
        ],
        order: [["updatedAt", "DESC"]],
      });
      expect(plain(result)).toEqual({ conversations });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe("findOne", () => {
    it("returns an error when the user doesn't exist", async () => {
      userSchema.findByPk.mockResolvedValue(null);

      const result = await service.findOne(userId, conversationId);

      expect(userSchema.findByPk).toHaveBeenCalledWith(userId);
      expect(plain(result)).toEqual({
        error: true,
        message: "User not found",
      });
      expect(supportConversationSchema.findOne).not.toHaveBeenCalled();
    });

    it("limits a regular user to their own conversations", async () => {
      userSchema.findByPk.mockResolvedValue({ id: userId, role: memberRole });

      await service.findOne(userId, conversationId);

      expect(supportConversationSchema.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: conversationId, userId } }),
      );
    });

    for (const role of [UserRole.ADMIN, UserRole.SUPPORT]) {
      it(`lets a ${role} user open any conversation`, async () => {
        userSchema.findByPk.mockResolvedValue({ id: userId, role });

        await service.findOne(userId, conversationId);

        expect(supportConversationSchema.findOne).toHaveBeenCalledWith(
          expect.objectContaining({ where: { id: conversationId } }),
        );
      });
    }

    it("includes the user, the last message sender and the user who closed it", async () => {
      userSchema.findByPk.mockResolvedValue({ id: userId, role: memberRole });

      await service.findOne(userId, conversationId);

      expect(supportConversationSchema.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          include: [
            expect.objectContaining({ as: "user" }),
            expect.objectContaining({ as: "lastMessageSender" }),
            expect.objectContaining({ as: "closedByUser" }),
          ],
        }),
      );
    });

    it("returns an error when the conversation isn't found", async () => {
      userSchema.findByPk.mockResolvedValue({ id: userId, role: memberRole });
      supportConversationSchema.findOne.mockResolvedValue(null);

      const result = await service.findOne(userId, conversationId);

      expect(plain(result)).toEqual({
        error: true,
        message: "Conversation not found",
      });
    });

    it("returns the conversation", async () => {
      const conversation = makeConversation();
      userSchema.findByPk.mockResolvedValue({ id: userId, role: memberRole });
      supportConversationSchema.findOne.mockResolvedValue(conversation);

      const result = await service.findOne(userId, conversationId);

      expect(plain(result)).toEqual({ conversation });
    });
  });

  // ───────────────────────── toggle ─────────────────────────
  describe("toggle", () => {
    it("returns an error when the conversation doesn't exist", async () => {
      supportConversationSchema.findByPk.mockResolvedValue(null);

      const result = await service.toggle(adminId, conversationId);

      expect(supportConversationSchema.findByPk).toHaveBeenCalledWith(
        conversationId,
      );
      expect(plain(result)).toEqual({
        error: true,
        message: "Conversation not found",
      });
    });

    it("closes an open conversation and records who closed it and when", async () => {
      const conversation = makeConversation({
        status: SupportConversationStatus.OPEN,
      });
      supportConversationSchema.findByPk.mockResolvedValue(conversation);

      const before = Date.now();
      const result = await service.toggle(adminId, conversationId);
      const after = Date.now();

      expect(conversation.status).toBe(SupportConversationStatus.CLOSED);
      expect(conversation.closedBy).toBe(adminId);
      expect(conversation.closedAt).toBeInstanceOf(Date);
      expect(conversation.closedAt?.getTime()).toBeGreaterThanOrEqual(before);
      expect(conversation.closedAt?.getTime()).toBeLessThanOrEqual(after);
      expect(conversation.save).toHaveBeenCalledTimes(1);
      expect(plain(result)).toEqual({
        success: true,
        message: "Support conversation closed successfully",
        data: conversation,
      });
    });

    it("reopens a closed conversation and clears who closed it", async () => {
      const conversation = makeConversation({
        status: SupportConversationStatus.CLOSED,
        closedAt: new Date(),
        closedBy: adminId,
      });
      supportConversationSchema.findByPk.mockResolvedValue(conversation);

      const result = await service.toggle("other-admin", conversationId);

      expect(conversation.status).toBe(SupportConversationStatus.OPEN);
      expect(conversation.closedAt).toBeNull();
      expect(conversation.closedBy).toBeNull();
      expect(conversation.save).toHaveBeenCalledTimes(1);
      expect(plain(result)).toEqual({
        success: true,
        message: "Support conversation opened successfully",
        data: conversation,
      });
    });
  });
});
