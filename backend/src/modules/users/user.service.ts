import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './schema/user.schema.js';
import { response } from '../../common/libs/response.js';
import { messages } from '../../common/libs/messages.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { NotificationService } from '../notifications/notification.service.js';
import { NotificationType } from '../../common/enums/notification.enum.js';
import { sanitizeUser } from '../../common/libs/sanitize-user.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
    @InjectModel(UserVerification)
    private readonly userVerificationModel: typeof UserVerification,
    private readonly notificationService: NotificationService,
  ) {}

  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows: users, count: total } = await this.userModel.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    const userIds = users.map((user) => user.id);

    const [profiles, verifications] = await Promise.all([
      this.userProfileModel.findAll({
        where: {
          userId: userIds,
        },
        attributes: ['id', 'userId', 'avatar', 'cover', 'bio'],
      }),

      this.userVerificationModel.findAll({
        where: {
          userId: userIds,
        },
        attributes: [
          'id',
          'userId',
          'profileImage',
          'identityDocument',
          'status',
          'rejectionReason',
          'submittedAt',
          'reviewedAt',
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

    const totalPages = Math.ceil(total / limit);

    return response(
      {
        users: safeUsers,
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

  async findOne(userId: string) {
    const user = await this.userModel.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(messages.user.notFound);
    }

    const [profile, verification] = await Promise.all([
      this.userProfileModel.findOne({
        where: {
          userId: user.id,
        },
        attributes: ['id', 'avatar', 'cover', 'bio'],
      }),

      this.userVerificationModel.findOne({
        where: {
          userId: user.id,
        },
        attributes: ['status'],
      }),
    ]);

    const safeUser = sanitizeUser(user);

    return response(
      {
        ...safeUser,
        profile: profile?.get({ plain: true }) ?? null,
        verification: verification?.get({ plain: true }) ?? null,
      },
      null,
    );
  }
  async udpateRole(userId: string, role: UserRole) {
    const allowedRoles = [
      UserRole.CLIENT,
      UserRole.FREELANCER,
      UserRole.SUPPORT,
    ];

    if (!allowedRoles.includes(role)) {
      throw new BadRequestException(messages.user.updateRole.invalidRole);
    }

    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(messages.user.notFound);
    }

    user.role = role;
    await user.save();

    return response(user, messages.user.updateRole.success);
  }

  async block(adminId: string, userId: string) {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(messages.user.notFound);
    }

    user.isActive = false;
    await user.save();

    await this.notificationService.create({
      senderId: adminId,
      receiverId: userId,
      targetId: userId,
      type: NotificationType.BLOCK_USER,
      message: 'Your account has been blocked.',
      link: null,
    });

    return response(user, messages.user.block.success);
  }
}
