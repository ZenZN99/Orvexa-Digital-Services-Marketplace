import { type UserSchema } from "./schemas/user.schema";
import { buildPagination } from "../../utilities/pagination";
import { sanitizeUser } from "../../utilities/sanitize-user";
import type { UserProfileSchema } from "../user-profiles/schemas/user-profile.schema";
import type { UserVerificationSchema } from "../user-verifications/schemas/user-verification.schema";
import { UserRole } from "./schemas/enums/users.enum";
import type { NotificationsService } from "../notifications/notifications.service";
import { NotificationType } from "../notifications/schemas/enums/notification.enum";

export class UsersService {
  constructor(
    private readonly userSchema: typeof UserSchema,
    private readonly userProfileSchema: typeof UserProfileSchema,
    private readonly userVerificationSchema: typeof UserVerificationSchema,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(page = 1, limit = 10, offset = (page - 1) * limit) {
    const { rows: users, count: total } = await this.userSchema.findAndCountAll(
      {
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      },
    );

    const userIds = users.map((user) => user.id);

    const [profiles, verifications] = await Promise.all([
      this.userProfileSchema.findAll({
        where: {
          userId: userIds,
        },
        attributes: ["id", "userId", "avatar", "cover", "bio"],
      }),

      this.userVerificationSchema.findAll({
        where: {
          userId: userIds,
        },
        attributes: [
          "id",
          "userId",
          "profileImage",
          "identityDocument",
          "status",
          "rejectionReason",
          "submittedAt",
          "reviewedAt",
        ],
      }),
    ]);

    const profileMap = new Map(
      profiles.map((profile) => [profile.userId, profile.get({ plain: true })]),
    );

    const verificationMap = new Map(
      verifications.map((verification) => [
        verification.userId,
        verification.get({ plain: true }),
      ]),
    );

    const safeUsers = users.map((user) => ({
      ...sanitizeUser(user),
      profile: profileMap.get(user.id) ?? null,
      verification: verificationMap.get(user.id) ?? null,
    }));

    return {
      success: true,
      safeUsers,
      pagination: buildPagination(total, page, limit),
    };
  }

  async findOne(id: string) {
    const user = await this.userSchema.findOne({ where: { id } });

    if (!user || !user.isActive) {
      return {
        error: true,
        message: "User not found",
      } as const;
    }

    const [profile, verification] = await Promise.all([
      this.userProfileSchema.findOne({
        where: {
          userId: user.id,
        },
        attributes: ["id", "avatar", "cover", "bio"],
      }),

      this.userVerificationSchema.findOne({
        where: {
          userId: user.id,
        },
        attributes: ["status"],
      }),
    ]);

    const safeUser = sanitizeUser(user);

    return {
      success: true,
      data: {
        ...safeUser,
        profile: profile?.get({ plain: true }) ?? null,
        verification: verification?.get({ plain: true }) ?? null,
      },
    };
  }

  async updateRole(id: string, role: UserRole) {
    const allowedRoles = [
      UserRole.CLIENT,
      UserRole.FREELANCER,
      UserRole.SUPPORT,
    ];

    if (!allowedRoles.includes(role)) {
      return {
        error: true,
        statusCode: 400,
        message: "Invalid user role",
      };
    }

    const user = await this.userSchema.findByPk(id);

    if (!user || !user.isActive) {
      return {
        error: true,
        statusCode: 404,
        message: "User not found",
      } as const;
    }

    user.role = role;
    await user.save();

    return {
      success: true,
      message: "User role updated successfully",
    } as const;
  }

  async block(adminId: string, userId: string) {
    const user = await this.userSchema.findByPk(userId);

    if (!user || !user.isActive) {
      return {
        error: true,
        message: "User not found",
      } as const;
    }

    user.isActive = false;
    await user.save();

    await this.notificationsService.create({
      senderId: adminId,
      receiverId: userId,
      targetId: userId,
      type: NotificationType.BLOCK_USER,
      message: "Your account has been blocked.",
      link: null,
    });

    return { success: true, message: "User blocked successfully" } as const;
  }
}
