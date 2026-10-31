import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { UserProfilesController } from './user-profiles.controller';
import { UserProfilesRouter } from './user-profiles.route';
import { CloudinaryManager } from '../../config/cloudinary/cloudinary';
import { UserProfileSchema } from './schemas/user-profile.schema';
import { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import { verifyUser } from '../../config/token/verify-user';

export class UserProfilesModule {
  register(bob: RiserBob): void {
    const cloudinaryManager = new CloudinaryManager();

    const controller = new UserProfilesController(
      UserProfileSchema,
      cloudinaryManager,
    );

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: 'cookie',
      cookieName: 'token',
    });

    const userActiveMiddleware = new UserActiveMiddleware();

    const router = new UserProfilesRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
    );

    router.register();
  }
}
