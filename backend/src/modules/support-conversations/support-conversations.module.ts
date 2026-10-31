import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { SupportConversationsController } from './support-conversations.controller';
import { SupportConversationsRouter } from './support-conversations.route';
import { SupportConversationSchema } from './schemas/support-conversation.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { verifyUser } from '../../config/token/verify-user';
import { RolesMiddleware } from '../../config/middlewares/roles.middleware';
import { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import { SupportConversationsService } from './support-conversations.service';

export class SupportConversationsModule {
  register(bob: RiserBob): void {
    const service = new SupportConversationsService(
      SupportConversationSchema,
      UserSchema,
    );
    const controller = new SupportConversationsController(service);

    const authMiddleware = new AuthMiddleware(verifyUser, {
      mode: 'cookie',
      cookieName: 'token',
    });

    const userActiveMiddleware = new UserActiveMiddleware();
    const rolesMiddleware = new RolesMiddleware();

    const router = new SupportConversationsRouter(
      bob,
      controller,
      authMiddleware,
      userActiveMiddleware,
      rolesMiddleware,
    );

    router.register();
  }
}
