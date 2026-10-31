import {
  MiddlewarePipeline,
  type SpongMiddleware,
  type SpongRequest,
  type SpongResponse,
} from "riser-bob";

import { AuthMiddleware } from "riser-bob";
import { UserActiveMiddleware } from "./user-active.middleware";
import { RolesMiddleware } from "./roles.middleware";
import { UserRole } from "../../modules/users/schemas/enums/users.enum";

export class ProtectedMiddleware {
  constructor(
    private readonly authMiddleware: AuthMiddleware,
    private readonly userActiveMiddleware: UserActiveMiddleware,
    private readonly rolesMiddleware: RolesMiddleware,
  ) {}

  auth(
    ...middlewares: SpongMiddleware<SpongRequest>[]
  ): SpongMiddleware<SpongRequest> {
    const pipeline = new MiddlewarePipeline<SpongRequest>();

    pipeline
      .use(this.authMiddleware.middleware)
      .use(this.userActiveMiddleware.middleware);

    for (const middleware of middlewares) {
      pipeline.use(middleware);
    }

    return (
      context: SpongRequest,
      spongRes: SpongResponse,
      spongNext: () => Promise<Response>,
    ) => pipeline.execute(context, spongRes, spongNext);
  }

  admin(): SpongMiddleware<SpongRequest> {
    return this.auth(this.rolesMiddleware.allow(UserRole.ADMIN));
  }

  freelancer(): SpongMiddleware<SpongRequest> {
    return this.auth(this.rolesMiddleware.allow(UserRole.FREELANCER));
  }

  client(): SpongMiddleware<SpongRequest> {
    return this.auth(this.rolesMiddleware.allow(UserRole.CLIENT));
  }

  freelancerAndClient(): SpongMiddleware<SpongRequest> {
    return this.auth(
      this.rolesMiddleware.allow(UserRole.FREELANCER, UserRole.CLIENT),
    );
  }

  adminAndSupport(): SpongMiddleware<SpongRequest> {
    return this.auth(
      this.rolesMiddleware.allow(UserRole.ADMIN, UserRole.SUPPORT),
    );
  }
}
