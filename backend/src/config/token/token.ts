import { HttpError } from 'riser-bob';
import jwt from 'jsonwebtoken';
import type { UserRole } from '../../modules/users/schemas/enums/users.enum';

interface TokenPayload {
  id: string;
  isActive: boolean;
  role: UserRole;
}
export class TokenManager {
  private secret(name: 'JWT_SECRET' | 'JWT_REFRESH_SECRET'): string {
    const value = process.env[name];

    if (!value) {
      throw new HttpError(500, name + 'is not defined');
    }

    return value;
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret('JWT_SECRET'), { expiresIn: '15m' });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret('JWT_REFRESH_SECRET'), {
      expiresIn: '30d',
    });
  }

  verifyAccessToken(token: string): TokenPayload | null {
    return this.verify(token, this.secret('JWT_SECRET'));
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    return this.verify(token, this.secret('JWT_REFRESH_SECRET'));
  }

  private verify(token: string, secret: string): TokenPayload | null {
    try {
      const payload = jwt.verify(token, secret);

      if (typeof payload === 'string' || typeof payload.id !== 'string') {
        return null;
      }

      return {
        id: payload.id,
        isActive: payload.isActive,
        role: payload.role,
      };
    } catch {
      return null;
    }
  }
}
