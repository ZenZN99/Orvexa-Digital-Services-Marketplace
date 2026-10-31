import type { RiserBob } from 'riser-bob';
import { AuthMiddleware } from 'riser-bob';
import { PlatformWalletsController } from './platform-wallets.controller';
import { ProtectedMiddleware } from '../../config/middlewares/protected.middleware';
import type { RolesMiddleware } from '../../config/middlewares/roles.middleware';
import type { UserActiveMiddleware } from '../../config/middlewares/user-active.middleware';
import type { UserVerificationMiddleware } from '../../config/middlewares/user-verification.middleware';

export class PlatformWalletsRouter {
  constructor(
    private readonly bob: RiserBob,
    private readonly controller: PlatformWalletsController,
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
    // Protected routes

    this.bob.spongGet(
      '/api/platform-wallets',
      this.controller.findBalance,
      protectedMiddleware.auth(),
      protectedMiddleware.admin(),
    );

    this.bob.spongPost(
      '/api/platform-wallets',
      this.controller.withdraw,
      protectedMiddleware.auth(),
      this.userVerificationMiddleware.middleware,
      protectedMiddleware.admin(),
    );
  }
}
