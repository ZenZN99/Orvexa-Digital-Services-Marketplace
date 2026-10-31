import { HttpError } from 'riser-bob';
import { TokenManager } from './token';
import { UserSchema } from '../../modules/users/schemas/user.schema';

const tokenManager = new TokenManager();

export async function verifyUser(token: string) {
  const payload = tokenManager.verifyAccessToken(token);

  if (!payload) {
    throw new HttpError(401, 'Token is invalid or expired');
  }

  const user = await UserSchema.findByPk(payload.id);

  if (!user) {
    throw new HttpError(401, 'You are not authenticated');
  }

  return {
    id: user.id,
    isActive: user.isActive,
    role: user.role,
  };
}
