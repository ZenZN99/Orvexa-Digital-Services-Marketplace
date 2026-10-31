import { beforeEach, describe, expect, it, mock, type Mock } from "bun:test";
import { buildPagination } from "../../../utilities/pagination";
import { sanitizeUser } from "../../../utilities/sanitize-user";
import type { NotificationsService } from "../../notifications/notifications.service";
import { NotificationType } from "../../notifications/schemas/enums/notification.enum";
import type { UserProfileSchema } from "../../user-profiles/schemas/user-profile.schema";
import type { UserVerificationSchema } from "../../user-verifications/schemas/user-verification.schema";
import { UserRole } from "../schemas/enums/users.enum";
import type { UserSchema } from "../schemas/user.schema";
import { UsersService } from "../users.service";

// ───────────────────────── types ─────────────────────────

type SanitizableUser = Parameters<typeof sanitizeUser>[0];

interface FakeUser {
  id: string;
  email: string;
  firstName: string;
  isActive: boolean;
  role: UserRole;
  save: Mock<() => Promise<void>>;
  toJSON: Mock<() => Record<string, unknown>>;
  get: Mock<(options?: unknown) => Record<string, unknown>>;
}

interface FakePlainRecord {
  userId: string;
  get: Mock<(options: unknown) => Record<string, unknown>>;
}

interface FakeUserSchema {
  findAndCountAll: Mock<
    (options: unknown) => Promise<{ rows: FakeUser[]; count: number }>
  >;
  findOne: Mock<(options: unknown) => Promise<FakeUser | null>>;
  findByPk: Mock<(id: string) => Promise<FakeUser | null>>;
}

interface FakeUserProfileSchema {
  findAll: Mock<(options: unknown) => Promise<FakePlainRecord[]>>;
  findOne: Mock<(options: unknown) => Promise<FakePlainRecord | null>>;
}

interface FakeUserVerificationSchema {
  findAll: Mock<(options: unknown) => Promise<FakePlainRecord[]>>;
  findOne: Mock<(options: unknown) => Promise<FakePlainRecord | null>>;
}

interface FakeNotificationsService {
  create: Mock<(data: unknown) => Promise<void>>;
}

// ───────────────────────── helpers ─────────────────────────

const adminId = "admin-1";
const userId = "user-1";

// The fake answers the ways a Sequelize model can be turned into plain data.
const makeUser = (overrides: Partial<FakeUser> = {}): FakeUser => {
  const id = overrides.id ?? userId;
  const plainData = { id, email: `${id}@test.com`, firstName: "Jane" };

  return {
    ...plainData,
    isActive: true,
    role: UserRole.CLIENT,
    save: mock(async (): Promise<void> => {}),
    toJSON: mock((): Record<string, unknown> => plainData),
    get: mock((_options?: unknown): Record<string, unknown> => plainData),
    ...overrides,
  };
};

const makePlainRecord = (
  recordUserId: string,
  data: Record<string, unknown>,
): FakePlainRecord => ({
  userId: recordUserId,
  get: mock((_options: unknown): Record<string, unknown> => data),
});

// The service sanitizes users with the real helper, so the expectations use it too.
const sanitized = (user: FakeUser) =>
  sanitizeUser(user as unknown as SanitizableUser);

// Compare results without fighting the service's narrow `as const` return types.
const plain = (value: unknown): unknown => value;

// ───────────────────────── tests ─────────────────────────

describe("UsersService", () => {
  let userSchema: FakeUserSchema;
  let userProfileSchema: FakeUserProfileSchema;
  let userVerificationSchema: FakeUserVerificationSchema;
  let notificationsService: FakeNotificationsService;
  let service: UsersService;

  beforeEach(() => {
    userSchema = {
      findAndCountAll: mock(
        async (
          _options: unknown,
        ): Promise<{ rows: FakeUser[]; count: number }> => ({
          rows: [],
          count: 0,
        }),
      ),
      findOne: mock(
        async (_options: unknown): Promise<FakeUser | null> => null,
      ),
      findByPk: mock(async (_id: string): Promise<FakeUser | null> => null),
    };
    userProfileSchema = {
      findAll: mock(
        async (_options: unknown): Promise<FakePlainRecord[]> => [],
      ),
      findOne: mock(
        async (_options: unknown): Promise<FakePlainRecord | null> => null,
      ),
    };
    userVerificationSchema = {
      findAll: mock(
        async (_options: unknown): Promise<FakePlainRecord[]> => [],
      ),
      findOne: mock(
        async (_options: unknown): Promise<FakePlainRecord | null> => null,
      ),
    };
    notificationsService = {
      create: mock(async (_data: unknown): Promise<void> => {}),
    };

    service = new UsersService(
      userSchema as unknown as typeof UserSchema,
      userProfileSchema as unknown as typeof UserProfileSchema,
      userVerificationSchema as unknown as typeof UserVerificationSchema,
      notificationsService as unknown as NotificationsService,
    );
  });

  // ───────────────────────── findAll ─────────────────────────
  describe("findAll", () => {
    it("uses the default page and limit when none are given", async () => {
      await service.findAll();

      expect(userSchema.findAndCountAll).toHaveBeenCalledWith({
        offset: 0,
        limit: 10,
        order: [["createdAt", "DESC"]],
      });
    });

    it("derives the offset from the page and limit", async () => {
      await service.findAll(3, 5);

      expect(userSchema.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 5, offset: 10 }),
      );
    });

    it("loads the profiles and the verifications of the listed users only", async () => {
      userSchema.findAndCountAll.mockResolvedValue({
        rows: [makeUser({ id: "u1" }), makeUser({ id: "u2" })],
        count: 2,
      });

      await service.findAll();

      expect(userProfileSchema.findAll).toHaveBeenCalledWith({
        where: { userId: ["u1", "u2"] },
        attributes: ["id", "userId", "avatar", "cover", "bio"],
      });
      expect(userVerificationSchema.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: ["u1", "u2"] } }),
      );
    });

    it("attaches each user's profile and verification to the sanitized user", async () => {
      const first = makeUser({ id: "u1" });
      const second = makeUser({ id: "u2" });
      userSchema.findAndCountAll.mockResolvedValue({
        rows: [first, second],
        count: 2,
      });
      userProfileSchema.findAll.mockResolvedValue([
        makePlainRecord("u1", { id: "p1", bio: "Hello" }),
      ]);
      userVerificationSchema.findAll.mockResolvedValue([
        makePlainRecord("u2", { id: "v2", status: "pending" }),
      ]);

      const result = await service.findAll();

      expect(plain(result)).toMatchObject({
        success: true,
        safeUsers: [
          {
            ...sanitized(first),
            profile: { id: "p1", bio: "Hello" },
            verification: null,
          },
          {
            ...sanitized(second),
            profile: null,
            verification: { id: "v2", status: "pending" },
          },
        ],
      });
    });

    it("returns the pagination built from the total", async () => {
      userSchema.findAndCountAll.mockResolvedValue({
        rows: [makeUser()],
        count: 12,
      });

      const result = await service.findAll(2, 5);

      expect(plain(result)).toMatchObject({
        pagination: buildPagination(12, 2, 5),
      });
    });
  });

  // ───────────────────────── findOne ─────────────────────────
  describe("findOne", () => {
    it("returns an error when the user doesn't exist", async () => {
      userSchema.findOne.mockResolvedValue(null);

      const result = await service.findOne(userId);

      expect(userSchema.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(plain(result)).toEqual({
        error: true,
        message: "User not found",
      });
    });

    it("returns the same error when the user is blocked", async () => {
      userSchema.findOne.mockResolvedValue(makeUser({ isActive: false }));

      const result = await service.findOne(userId);

      expect(plain(result)).toEqual({
        error: true,
        message: "User not found",
      });
      expect(userProfileSchema.findOne).not.toHaveBeenCalled();
    });

    it("loads the profile and the verification status of the user", async () => {
      userSchema.findOne.mockResolvedValue(makeUser());

      await service.findOne(userId);

      expect(userProfileSchema.findOne).toHaveBeenCalledWith({
        where: { userId },
        attributes: ["id", "avatar", "cover", "bio"],
      });
      expect(userVerificationSchema.findOne).toHaveBeenCalledWith({
        where: { userId },
        attributes: ["status"],
      });
    });

    it("returns the sanitized user with its profile and verification", async () => {
      const user = makeUser();
      userSchema.findOne.mockResolvedValue(user);
      userProfileSchema.findOne.mockResolvedValue(
        makePlainRecord(userId, { id: "p1", bio: "Hello" }),
      );
      userVerificationSchema.findOne.mockResolvedValue(
        makePlainRecord(userId, { status: "approved" }),
      );

      const result = await service.findOne(userId);

      expect(plain(result)).toEqual({
        success: true,
        data: {
          ...sanitized(user),
          profile: { id: "p1", bio: "Hello" },
          verification: { status: "approved" },
        },
      });
    });

    it("returns null for a missing profile and verification", async () => {
      const user = makeUser();
      userSchema.findOne.mockResolvedValue(user);

      const result = await service.findOne(userId);

      expect(plain(result)).toEqual({
        success: true,
        data: { ...sanitized(user), profile: null, verification: null },
      });
    });
  });

  // ───────────────────────── updateRole ─────────────────────────
  describe("updateRole", () => {
    for (const role of [UserRole.ADMIN, "not-a-role" as unknown as UserRole]) {
      it(`returns 400 for the role "${role}" without looking for the user`, async () => {
        const result = await service.updateRole(userId, role);

        expect(plain(result)).toEqual({
          error: true,
          statusCode: 400,
          message: "Invalid user role",
        });
        expect(userSchema.findByPk).not.toHaveBeenCalled();
      });
    }

    it("returns 404 when the user doesn't exist", async () => {
      userSchema.findByPk.mockResolvedValue(null);

      const result = await service.updateRole(userId, UserRole.SUPPORT);

      expect(userSchema.findByPk).toHaveBeenCalledWith(userId);
      expect(plain(result)).toEqual({
        error: true,
        statusCode: 404,
        message: "User not found",
      });
    });

    it("returns 404 when the user is blocked", async () => {
      const user = makeUser({ isActive: false });
      userSchema.findByPk.mockResolvedValue(user);

      const result = await service.updateRole(userId, UserRole.SUPPORT);

      expect(plain(result)).toMatchObject({ error: true, statusCode: 404 });
      expect(user.save).not.toHaveBeenCalled();
    });

    for (const role of [
      UserRole.CLIENT,
      UserRole.FREELANCER,
      UserRole.SUPPORT,
    ]) {
      it(`changes the role to ${role} and saves`, async () => {
        const user = makeUser({ role: UserRole.ADMIN });
        userSchema.findByPk.mockResolvedValue(user);

        const result = await service.updateRole(userId, role);

        expect(user.role).toBe(role);
        expect(user.save).toHaveBeenCalledTimes(1);
        expect(plain(result)).toEqual({
          success: true,
          message: "User role updated successfully",
        });
      });
    }

    it.todo(
      "refuses to change the role of an admin account (an admin can be demoted to any allowed role today)",
    );
  });

  // ───────────────────────── block ─────────────────────────
  describe("block", () => {
    it("returns an error when the user doesn't exist", async () => {
      userSchema.findByPk.mockResolvedValue(null);

      const result = await service.block(adminId, userId);

      expect(userSchema.findByPk).toHaveBeenCalledWith(userId);
      expect(plain(result)).toEqual({
        error: true,
        message: "User not found",
      });
      expect(notificationsService.create).not.toHaveBeenCalled();
    });

    it("returns the same error when the user is already blocked", async () => {
      const user = makeUser({ isActive: false });
      userSchema.findByPk.mockResolvedValue(user);

      const result = await service.block(adminId, userId);

      expect(plain(result)).toEqual({
        error: true,
        message: "User not found",
      });
      expect(user.save).not.toHaveBeenCalled();
    });

    it("deactivates the user and saves", async () => {
      const user = makeUser({ isActive: true });
      userSchema.findByPk.mockResolvedValue(user);

      await service.block(adminId, userId);

      expect(user.isActive).toBe(false);
      expect(user.save).toHaveBeenCalledTimes(1);
    });

    it("notifies the user that the account was blocked", async () => {
      userSchema.findByPk.mockResolvedValue(makeUser());

      await service.block(adminId, userId);

      expect(notificationsService.create).toHaveBeenCalledWith({
        senderId: adminId,
        receiverId: userId,
        targetId: userId,
        type: NotificationType.BLOCK_USER,
        message: "Your account has been blocked.",
        link: null,
      });
    });

    it("returns a success message", async () => {
      userSchema.findByPk.mockResolvedValue(makeUser());

      const result = await service.block(adminId, userId);

      expect(plain(result)).toEqual({
        success: true,
        message: "User blocked successfully",
      });
    });
  });
});
