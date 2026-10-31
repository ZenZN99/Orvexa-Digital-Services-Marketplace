import type { SpongHandler } from 'riser-bob';
import { UserRole } from '../users/schemas/enums/users.enum';
import type { AuthService } from './auth.service';
import type { AuthenticationUser } from '../users/schemas/user.schema';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  readonly register: SpongHandler = async (spongReq, spongRes) => {
    const body = await spongReq.json<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role: UserRole;
    }>();

    const result = await this.authService.register(body, spongReq);

    if ('error' in result) {
      if (result.statusCode === 422) {
        return spongRes.SpongUnprocessableContent({
          success: false,
          message: result.message,
          errors: result.errors,
        });
      }

      return spongRes.SpongBadRequest({
        success: false,
        message: result.message,
      });
    }

    return result;
  };

  readonly login: SpongHandler = async (spongReq, spongRes) => {
    const body = await spongReq.json<{
      email: string;
      password: string;
    }>();

    const result = await this.authService.login(body, spongReq);

    if ('error' in result) {
      if (result.statusCode === 422) {
        return spongRes.SpongUnprocessableContent({
          success: false,
          message: result.message,
          errors: result.errors,
        });
      }

      return spongRes.SpongBadRequest({
        success: false,
        message: result.message,
      });
    }

    return result;
  };

  readonly logout: SpongHandler = async (spongReq, spongRes) => {
    const result = await this.authService.logout(spongReq);

    return result;
  };

  readonly me: SpongHandler = async (spongReq, spongRes) => {
    const currentUser = spongReq.user!;

    const result = await this.authService.me(currentUser as AuthenticationUser);

    return spongRes.SpongOK({
      success: result.success,
      data: result.data,
    });
  };

  readonly refreshToken: SpongHandler = async (spongReq, spongRes) => {
    const result = await this.authService.refreshToken(spongReq);

    if ('error' in result) {
      return spongRes.SpongUnauthorized({
        success: false,
        message: result.message,
      });
    }

    return result;
  };
}
