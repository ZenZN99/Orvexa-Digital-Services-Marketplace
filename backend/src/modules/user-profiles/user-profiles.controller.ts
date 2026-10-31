import { Validator } from 'riser-bob';
import type { SpongHandler } from 'riser-bob';
import type { CloudinaryManager } from '../../config/cloudinary/cloudinary';
import type { UserProfileSchema } from './schemas/user-profile.schema';
import { UpdateUserProfileRule } from './rules/update.rule';

type UploadResult = Awaited<ReturnType<CloudinaryManager['upload']>>;

export class UserProfilesController {
  constructor(
    private readonly userProfileSchema: typeof UserProfileSchema,
    private readonly cloudinaryManager: CloudinaryManager,
  ) {}

  // Deleting an image must never break the request: failures are only logged.
  private async safeDestroy(publicId: string | undefined | null) {
    if (!publicId) {
      return;
    }

    try {
      await this.cloudinaryManager.destroy(publicId);
    } catch (error) {
      console.error(`Failed to delete Cloudinary image ${publicId}:`, error);
    }
  }

  readonly update: SpongHandler = async (spongReq, spongRes) => {
    const userId = spongReq.user!.id;

    const formData = await spongReq.formData();

    const profile = await this.userProfileSchema.findOne({
      where: { userId },
    });

    if (!profile) {
      return spongRes.SpongNotFound({
        success: false,
        message: 'Profile not found',
      });
    }

    const avatar = formData.get('avatar');
    const cover = formData.get('cover');
    const rawBio = formData.get('bio');

    // undefined = bio was not sent (leave it untouched)
    // null      = empty text (clear the bio)
    // string    = validated and trimmed text
    let nextBio: string | null | undefined;

    if (typeof rawBio === 'string') {
      const trimmedBio = rawBio.trim();

      if (trimmedBio === '') {
        nextBio = null;
      } else {
        // Validate before any upload so invalid input never touches Cloudinary.
        const validation = Validator.validate(
          { bio: trimmedBio },
          UpdateUserProfileRule,
        );

        if (!validation.valid) {
          return spongRes.SpongUnprocessableContent({
            success: false,
            message: 'Validation failed',
            errors: validation.errors,
          });
        }

        nextBio = trimmedBio;
      }
    }

    // Remember the old images; they are deleted only after the save succeeds.
    const oldAvatarPublicId = profile.avatar?.publicId;
    const oldCoverPublicId = profile.cover?.publicId;

    const uploaded: UploadResult[] = [];
    let newAvatar: UploadResult | undefined;
    let newCover: UploadResult | undefined;

    try {
      if (avatar instanceof File && avatar.size > 0) {
        newAvatar = await this.cloudinaryManager.upload(
          avatar,
          'user-profiles/avatars',
        );
        uploaded.push(newAvatar);
      }

      if (cover instanceof File && cover.size > 0) {
        newCover = await this.cloudinaryManager.upload(
          cover,
          'user-profiles/covers',
        );
        uploaded.push(newCover);
      }

      if (newAvatar) {
        profile.avatar = newAvatar;
      }

      if (newCover) {
        profile.cover = newCover;
      }

      if (nextBio !== undefined) {
        profile.bio = nextBio;
      }

      await profile.save();
    } catch (error) {
      // An upload or the save failed: remove images uploaded in this request
      // so they are not left orphaned. Old images were not touched.
      await Promise.all(
        uploaded.map((result) => this.safeDestroy(result.publicId)),
      );

      throw error;
    }

    // The profile is saved: now it is safe to remove the replaced images.
    if (newAvatar) {
      await this.safeDestroy(oldAvatarPublicId);
    }

    if (newCover) {
      await this.safeDestroy(oldCoverPublicId);
    }

    return spongRes.SpongOK({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  };
}
