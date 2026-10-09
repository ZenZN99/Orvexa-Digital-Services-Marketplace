import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserVerification } from './schema/user-verification.schema.js';
import { CloudinaryService } from '../../infrastructure/cloudinary/cloudinary.service.js';
import { User } from '../users/schema/user.schema.js';
import { messages } from '../../common/libs/messages.js';
import { UserVerificationStatus } from '../../common/enums/user-verification.enum.js';
import { response } from '../../common/libs/response.js';
import { UpdateUserVerificationDTO } from './dto/update.js';
import { NotificationService } from '../notifications/notification.service.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { NotificationType } from '../../common/enums/notification.enum.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';

@Injectable()
export class UserVerificationService {
  constructor(
    @InjectModel(UserVerification)
    private readonly userVerificationModel: typeof UserVerification,

    @InjectModel(User)
    private readonly userModel: typeof User,

    private readonly cloudinaryService: CloudinaryService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    userId: string,
    profileImage: Express.Multer.File,
    identityDocument: Express.Multer.File,
  ) {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException(messages.user.notFound);
    }

    const existingVerification = await this.userVerificationModel.findOne({
      where: {
        userId,
      },
    });

    if (existingVerification) {
      if (existingVerification.status === UserVerificationStatus.PENDING) {
        throw new BadRequestException(messages.userVerification.alreadyPending);
      }

      if (existingVerification.status === UserVerificationStatus.APPROVED) {
        throw new BadRequestException(
          messages.userVerification.alreadyVerified,
        );
      }

      await this.deleteImages(existingVerification);
    }

    const uploadedProfileImage = await this.cloudinaryService.upload(
      profileImage,
      'verifications/profile',
    );

    const uploadedIdentityDocument = await this.cloudinaryService.upload(
      identityDocument,
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

      const admins = await this.userModel.findAll({
        where: {
          role: UserRole.ADMIN,
        },
      });

      for (const admin of admins) {
        await this.notificationService.create({
          senderId: userId,
          receiverId: admin.id,
          targetId: existingVerification.id,
          type: NotificationType.USER_VERIFICATION,
          message: 'A user has resubmitted an identity verification request.',
          link: '/admin',
        });
      }

      return response(
        existingVerification,
        messages.userVerification.resubmit.success,
      );
    }

    const verification = await this.userVerificationModel.create({
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

    const admins = await this.userModel.findAll({
      where: {
        role: UserRole.ADMIN,
      },
    });

    for (const admin of admins) {
      await this.notificationService.create({
        senderId: userId,
        receiverId: admin.id,
        targetId: verification.id,
        type: NotificationType.USER_VERIFICATION,
        message: 'A new identity verification request has been submitted.',
        link: '/admin',
      });
    }

    return response(verification, messages.userVerification.create.success);
  }

  async findPending(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows: verifications, count: total } =
      await this.userVerificationModel.findAndCountAll({
        where: {
          status: UserVerificationStatus.PENDING,
        },

        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'isActive'],
            include: [
              {
                model: UserProfile,
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

    const totalPages = Math.ceil(total / limit);

    return response(
      {
        verifications,
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

  async tryAgain(userId: string) {
    const verification = await this.userVerificationModel.findOne({
      where: {
        userId,
      },
    });

    if (!verification) {
      throw new NotFoundException(messages.userVerification.notFound);
    }

    if (verification.status === UserVerificationStatus.PENDING) {
      throw new BadRequestException(messages.userVerification.alreadyPending);
    }

    if (verification.status === UserVerificationStatus.APPROVED) {
      throw new BadRequestException(messages.userVerification.alreadyVerified);
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

    return response(verification, null);
  }

  async updateStatus(
    adminId: string,
    verificationId: string,
    data: UpdateUserVerificationDTO,
  ) {
    const verification =
      await this.userVerificationModel.findByPk(verificationId);

    if (!verification) {
      throw new NotFoundException(messages.userVerification.notFound);
    }

    if (verification.status !== UserVerificationStatus.PENDING) {
      throw new BadRequestException(messages.userVerification.alreadyReviewed);
    }

    if (
      data.status === UserVerificationStatus.REJECTED &&
      !data.rejectionReason?.trim()
    ) {
      throw new BadRequestException(
        messages.userVerification.rejectionReasonRequired,
      );
    }

    if (data.status === UserVerificationStatus.APPROVED) {
      verification.rejectionReason =
        'Congratulations! Your identity has been verified successfully.';
    }

    if (data.status === UserVerificationStatus.REJECTED) {
      verification.rejectionReason = data.rejectionReason!.trim();
    }

    verification.status = data.status;
    verification.reviewedBy = adminId;
    verification.reviewedAt = new Date();

    await verification.save();

    await this.notificationService.create({
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

    return response(
      verification,
      messages.userVerification.updateStatus.success,
    );
  }

  private async deleteImages(verification: UserVerification) {
    if (verification.profileImage?.publicId) {
      await this.cloudinaryService.destroy(verification.profileImage.publicId);
    }

    if (verification.identityDocument?.publicId) {
      await this.cloudinaryService.destroy(
        verification.identityDocument.publicId,
      );
    }
  }
}
