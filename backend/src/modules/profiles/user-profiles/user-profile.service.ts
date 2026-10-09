import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserProfile } from './schema/user-profile.schema.js';
import { UpdateUserProfileDTO } from './dto/update.js';
import { CloudinaryService } from '../../../infrastructure/cloudinary/cloudinary.service.js';
import { messages } from '../../../common/libs/messages.js';
import { response } from '../../../common/libs/response.js';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async update(
    userId: string,
    data: UpdateUserProfileDTO,
    avatar?: Express.Multer.File,
    cover?: Express.Multer.File,
  ) {
    const profile = await this.userProfileModel.findOne({
      where: {
        userId,
      },
    });

    if (!profile) {
      throw new NotFoundException(messages.userProfile.notFound);
    }

    if (avatar) {
      const result = await this.cloudinaryService.upload(
        avatar,
        'user-profiles/avatars',
      );

      if (profile.avatar?.publicId) {
        await this.cloudinaryService.destroy(profile.avatar.publicId);
      }

      profile.avatar = result;
    }

    if (cover) {
      const result = await this.cloudinaryService.upload(
        cover,
        'user-profiles/covers',
      );

      if (profile.cover?.publicId) {
        await this.cloudinaryService.destroy(profile.cover.publicId);
      }

      profile.cover = result;
    }

    if (data.bio !== undefined) {
      profile.bio = data.bio;
    }

    await profile.save();

    return response(profile, messages.userProfile.update.success);
  }
}
