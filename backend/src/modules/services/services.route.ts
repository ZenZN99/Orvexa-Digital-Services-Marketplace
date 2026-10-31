import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { ServicesController } from './services.controller';
import type { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import type { RolesMiddleware } from '../../config/middlewares/roles.middleware';
import { ProtectedMiddleware } from '../../config/middlewares/protected.middleware';
import type { UserVerificationMiddleware } from '../../config/middlewares/user-verification.middleware';

export class ServicesRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: ServicesController,
    private readonly authMiddleware: AuthMiddleware,
    private readonly userActiveMiddleware: UserActiveMiddleware,
    private readonly userVerificationMiddleware: UserVerificationMiddleware,
    private readonly rolesMiddleware: RolesMiddleware,
  ) {}

  register(): void {
    const protectedMiddleware = new ProtectedMiddleware(
      this.authMiddleware,
      this.userActiveMiddleware,
      this.rolesMiddleware,
    );

    // Public routes

    this.bob.spongGet('/api/services', this.controller.findAll);

    this.bob.spongGet('/api/services/:serviceId', this.controller.findOne);

    // Protected routes

    this.bob.spongPost(
      '/api/services',
      this.controller.create,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
      protectedMiddleware.freelancer(),
    );

    this.bob.spongGet(
      '/api/services/me',
      this.controller.findMe,
      protectedMiddleware.auth(),
    );

    this.bob.spongGet(
      '/api/services/freelancer/:userId',
      this.controller.findByFreelancer,
      protectedMiddleware.auth(),
    );

    this.bob.spongGet(
      '/api/services/pending',
      this.controller.findPending,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
      protectedMiddleware.admin(),
    );

    this.bob.spongPut(
      '/api/services/:serviceId',
      this.controller.update,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
    );

    this.bob.spongPut(
      '/api/services/:serviceId/status',
      this.controller.updateStatus,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
      protectedMiddleware.admin(),
    );

    this.bob.spongDelete(
      '/api/services/:serviceId',
      this.controller.delete,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
    );
  }
}
