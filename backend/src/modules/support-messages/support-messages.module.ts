import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { SupportMessagesController } from './support-messages.controller';
import { SupportMessagesRouter } from './support-messages.route';
import { CloudinaryManager } from '../../config/cloudinary/cloudinary';
import { SupportMessageSchema } from './schemas/support-message.schema';
import { SupportConversationSchema } from '../support-conversations/schemas/support-conversation.schema';
import { verifyUser } from '../../config/token/verify-user';
import { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import { RolesMiddleware } from '../../config/middlewares/roles.middleware';
import { SupportMessagesService } from './support-messages.service';

export class SupportMessagesModule {
  register(bob: RiserBob): void {
    const cloudinaryManager = new CloudinaryManager();

    const service = new SupportMessagesService(
      SupportMessageSchema,
      SupportConversationSchema,
      cloudinaryManager,
    );
    const controller = new SupportMessagesController(service);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: 'cookie',
      cookieName: 'token',
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const rolesMiddleware = new RolesMiddleware();

    const router = new SupportMessagesRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
      rolesMiddleware,
    );

    router.register();
  }
}
