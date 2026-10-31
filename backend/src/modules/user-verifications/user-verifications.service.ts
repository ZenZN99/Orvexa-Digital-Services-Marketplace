import { UserVerificationSchema } from './schemas/user-verification.schema';
import type { CloudinaryManager } from '../../config/cloudinary/cloudinary';
import { UserVerificationStatus } from './schemas/enums/user-verification.enum';
import { UserSchema } from '../users/schemas/user.schema';
import { UserProfileSchema } from '../user-profiles/schemas/user-profile.schema';
import { Validator } from 'riser-bob';
import { UpdateUserVerificationRule } from './rules/update.rule';
import type { NotificationsService } from '../notifications/notifications.service';
import { UserRole } from '../users/schemas/enums/users.enum';
import { NotificationType } from '../notifications/schemas/enums/notification.enum';

export class UserVerificationsService {
  constructor(
    private readonly userVerificationSchema: typeof UserVerificationSchema,
    private readonly userSchema: typeof UserSchema,
    private readonly notificationsService: NotificationsService,
    private readonly cloudinaryManager: CloudinaryManager,
  ) {}

  async create(
    userId: string,
    formData: {
      get(name: string): string | File | null;
    },
  ) {
    const existingVerification = await this.userVerificationSchema.findOne({
      where: {
        userId,
      },
    });

    if (existingVerification) {
      if (existingVerification.status === UserVerificationStatus.PENDING) {
        return {
          error: true,
          statusCode: 400,
          message: 'Your verification request is already pending review.',
        } as const;
      }

      if (existingVerification.status === UserVerificationStatus.APPROVED) {
        return {
          error: true,
          statusCode: 400,
          message: 'Your account has already been verified.',
        } as const;
      }

      await this.deleteImages(existingVerification);
    }

    const profileImage = formData.get('profileImage');
    const identityDocument = formData.get('identityDocument');

    const uploadedProfileImage = await this.cloudinaryManager.upload(
      profileImage as File,
      'verifications/profile',
    );

    const uploadedIdentityDocument = await this.cloudinaryManager.upload(
      identityDocument as File,
      'verifications/identity',
    );

    if (existingVerification) {
      existingVerification.profileImage = {
        url: uploadedProfileImage.url,
        publicId: uploadedProfileImage.publicId,
      };

      existingVerification.identityDocument = {
        url: uploadedIdentityDocument.url,
        publicId: uploadedIdentityDocument.publicId,
      };

      existingVerification.status = UserVerificationStatus.PENDING;

      existingVerification.rejectionReason = null;
      existingVerification.reviewedBy = null;
      existingVerification.reviewedAt = null;
      existingVerification.submittedAt = new Date();

      await existingVerification.save();

      const admins = await this.userSchema.findAll({
        where: {
          role: UserRole.ADMIN,
        },
      });

      for (const admin of admins) {
        await this.notificationsService.create({
          senderId: userId,
          receiverId: admin.id,
          targetId: existingVerification.id,
          type: NotificationType.USER_VERIFICATION,
          message: 'A user has resubmitted an identity verification request.',
          link: '/admin',
        });
      }

      return {
        type: 'resubmitted',
        data: existingVerification,
      } as const;
    }

    const verification = await this.userVerificationSchema.create({
      userId,
      profileImage: {
        url: uploadedProfileImage.url,
        publicId: uploadedProfileImage.publicId,
      },

      identityDocument: {
        url: uploadedIdentityDocument.url,
        publicId: uploadedIdentityDocument.publicId,
      },

      status: UserVerificationStatus.PENDING,

      submittedAt: new Date(),
    });

    const admins = await this.userSchema.findAll({
      where: {
        role: UserRole.ADMIN,
      },
    });

    for (const admin of admins) {
      await this.notificationsService.create({
        senderId: userId,
        receiverId: admin.id,
        targetId: verification.id,
        type: NotificationType.USER_VERIFICATION,
        message: 'A new identity verification request has been submitted.',
        link: '/admin',
      });
    }

    return {
      type: 'created',
      data: verification,
    } as const;
  }

  async findPending(page = 1, limit = 10, offset = (page - 1) * limit) {
    const { rows: verifications, count: total } =
      await this.userVerificationSchema.findAndCountAll({
        where: {
          status: UserVerificationStatus.PENDING,
        },
        include: [
          {
            model: UserSchema,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'isActive'],
            include: [
              {
                model: UserProfileSchema,
                as: 'profile',
                attributes: ['id', 'avatar', 'cover', 'bio'],
              },
            ],
          },
        ],
        order: [['submittedAt', 'ASC']],
        offset,
        limit,
      });

    return {
      verifications,
      total,
      page,
      limit,
    };
  }

  async tryAgain(userId: string) {
    const verification = await this.userVerificationSchema.findOne({
      where: { userId },
    });

    if (!verification) {
      return {
        error: true,
        statusCode: 404,
        message: 'No verification request was found for this user.',
      } as const;
    }

    if (verification.status === UserVerificationStatus.PENDING) {
      return {
        error: true,
        statusCode: 400,
        message: 'Your verification request is already pending review.',
      } as const;
    }

    if (verification.status === UserVerificationStatus.APPROVED) {
      return {
        error: true,
        statusCode: 400,
        message: 'Your account has already been verified.',
      } as const;
    }

    await this.deleteImages(verification);

    verification.profileImage = null;
    verification.identityDocument = null;
    verification.status = null;
    verification.rejectionReason = null;
    verification.reviewedBy = null;
    verification.reviewedAt = null;
    verification.submittedAt = null;

    await verification.save();

    return {
      data: verification,
    } as const;
  }

  async update(
    adminId: string,
    verificationId: string,
    body: {
      status: UserVerificationStatus | null;
      rejectionReason: string | null;
    },
  ) {
    const verification =
      await this.userVerificationSchema.findByPk(verificationId);

    if (!verification) {
      return {
        error: true,
        statusCode: 404,
        message: 'No verification request was found for this user.',
      } as const;
    }

    if (verification.status !== UserVerificationStatus.PENDING) {
      return {
        error: true,
        statusCode: 400,
        message: 'This verification request is not pending review.',
      } as const;
    }

    const validation = Validator.validate(body, UpdateUserVerificationRule);

    if (!validation.valid) {
      return {
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors: validation.errors,
      } as const;
    }

    const data = validation.data as UserVerificationSchema;

    if (
      data.status === UserVerificationStatus.REJECTED &&
      !data.rejectionReason?.trim()
    ) {
      return {
        error: true,
        statusCode: 400,
        message:
          'A rejection reason is required when rejecting a verification request.',
      } as const;
    }

    if (data.status === UserVerificationStatus.APPROVED) {
      verification.rejectionReason =
        'Congratulations! Your identity has been verified successfully.';
    }

    if (data.status === UserVerificationStatus.REJECTED) {
      verification.rejectionReason = data.rejectionReason!.trim();
    }

    verification.status = data.status;
    verification.reviewedBy = adminId as string;
    verification.reviewedAt = new Date();

    await verification.save();

    await this.notificationsService.create({
      senderId: adminId,
      receiverId: verification.userId,
      targetId: verification.id,
      type:
        data.status === UserVerificationStatus.APPROVED
          ? NotificationType.USER_VERIFICATION_APPROVED
          : NotificationType.USER_VERIFICATION_REJECTED,
      message:
        data.status === UserVerificationStatus.APPROVED
          ? 'Your identity verification has been approved.'
          : 'Your identity verification has been rejected.',
      link: '/identity-verification',
    });

    return { data: verification } as const;
  }

  private async deleteImages(verification: UserVerificationSchema) {
    if (verification.profileImage?.publicId) {
      await this.cloudinaryManager.destroy(verification.profileImage.publicId);
    }

    if (verification.identityDocument?.publicId) {
      await this.cloudinaryManager.destroy(
        verification.identityDocument.publicId,
      );
    }
  }
}
