import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/schema/user.schema.js';
import { RegisterDTO } from './dto/register.js';
import { Request, Response } from 'express';
import { TokenService } from '../../infrastructure/token/token.service.js';
import { messages } from '../../common/libs/messages.js';
import bcrypt from 'bcryptjs';
import { UserRole } from '../../common/enums/user.enum.js';
import { sanitizeUser } from '../../common/libs/sanitize-user.js';
import { response } from '../../common/libs/response.js';
import { LoginDTO } from './dto/login.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
import { RedisHelper } from '../../infrastructure/database/redis/redis.helper.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { JobTitle } from '../../common/enums/freelancer.enum.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
    @InjectModel(UserVerification)
    private readonly userVerificationModel: typeof UserVerification,
    @InjectModel(Freelancer)
    private readonly freelancerModel: typeof Freelancer,
    private readonly tokenService: TokenService,
    private readonly redis: RedisHelper,
  ) {}

  private getCookieOptions(isLogout = false) {
    return {
      httpOnly: true,
      secure: true, // production : true // localhost: false
      sameSite: 'none' as const, // production : none // localhost: lax
      maxAge: isLogout ? 0 : 365 * 24 * 60 * 60 * 1000,
    };
  }

  private getRefreshCookieOptions() {
    return {
      httpOnly: true,
      secure: true, // production : true // localhost: false
      sameSite: 'none' as const, // production : none // localhost: lax
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    };
  }

  async register(data: RegisterDTO, res: Response) {
    const { firstName, lastName, email, password, role } = data;

    const existing = await this.userModel.findOne({ where: { email } });

    if (existing) {
      throw new ConflictException(messages.auth.register.failed);
    }

    const hashed = await bcrypt.hash(password, 12);

    const newUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashed,
      role: role ?? UserRole.FREELANCER,
      isActive: true,
      balance: 0,
      frozenBalance: 0,
      lastLoginAt: new Date(),
    });

    await this.userProfileModel.create({
      userId: newUser.id,
      avatar: {
        url: 'https://res.cloudinary.com/dgagbheuj/image/upload/v1763194734/avatar-default-image_yc4xy4.jpg',
        publicId: '',
      },
      cover: {
        url: 'https://res.cloudinary.com/dgagbheuj/image/upload/v1763194811/cover-default-image_uunwq6.jpg',
        publicId: '',
      },
      bio: 'No bio yet.',
    });

    if (newUser.role === UserRole.FREELANCER) {
      await this.freelancerModel.create({
        userId: newUser.id,
        jobTitle: JobTitle.NO_JOB_TITLE,
        about: 'No about yet.',
        skills: [],
        website: null,
        completedOrders: 0,
        ratingCount: 0,
        ratingAverage: 0,
      });
    }

    const accessToken = this.tokenService.generateAccessToken({
      id: newUser.id,
      role: newUser.role,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      id: newUser.id,
    });

    newUser.refreshToken = await bcrypt.hash(refreshToken, 12);
    await newUser.save();

    res.cookie('token', accessToken, this.getCookieOptions());
    res.cookie('refreshToken', refreshToken, this.getRefreshCookieOptions());

    const safeUser = sanitizeUser(newUser);

    return response(safeUser, messages.auth.register.success);
  }

  async login(data: LoginDTO, res: Response) {
    const { email, password } = data;

    // Create a unique Redis key for tracking failed login attempts for this email.
    const key = `auth:login:attempts:${email.toLowerCase().trim()}`;

    // Get the current number of failed login attempts from Redis.
    const attempts = await this.redis.get(key);

    // Block login when this email reaches 5 failed attempts.
    if (attempts && Number(attempts) >= 5) {
      throw new UnauthorizedException(
        'Too many login attempts. Please try again later.',
      );
    }

    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) {
      // Increase the failed login attempts counter in Redis.
      const currentAttempts = await this.redis.incr(key);

      // Set a 15-minute TTL when the first failed attempt is recorded.
      if (currentAttempts === 1) {
        await this.redis.set(key, currentAttempts, 15 * 60);
      }

      throw new BadRequestException(messages.auth.login.failed);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Increase the failed login attempts counter in Redis.
      const currentAttempts = await this.redis.incr(key);

      // Set a 15-minute TTL when the first failed attempt is recorded.
      if (currentAttempts === 1) {
        await this.redis.set(key, currentAttempts, 15 * 60);
      }

      throw new BadRequestException(messages.auth.login.failed);
    }

    // Delete the failed login attempts counter after a successful login.
    await this.redis.del(key);

    const accessToken = this.tokenService.generateAccessToken({
      id: user.id,
      role: user.role,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      id: user.id,
    });

    user.refreshToken = await bcrypt.hash(refreshToken, 12);

    user.lastLoginAt = new Date();

    await user.save();

    res.cookie('token', accessToken, this.getCookieOptions());

    res.cookie('refreshToken', refreshToken, this.getRefreshCookieOptions());

    const safeUser = sanitizeUser(user);

    return response(safeUser, messages.auth.login.success);
  }

  async logout(res: Response, userId: string) {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new UnauthorizedException(messages.auth.me.notFound);
    }

    res.clearCookie('token', this.getCookieOptions(true));
    res.clearCookie('refreshToken', this.getRefreshCookieOptions());

    return response(null, messages.auth.logout.success);
  }

  async me(userId: string) {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new UnauthorizedException(messages.auth.me.notFound);
    }

    const profile = await this.userProfileModel.findOne({
      where: {
        userId,
      },
      attributes: ['id', 'avatar', 'cover', 'bio'],
    });

    const verification = await this.userVerificationModel.findOne({
      where: { userId },
      attributes: ['id', 'status', 'submittedAt', 'rejectionReason'],
    });

    const safeUser = sanitizeUser(user);

    return response(
      {
        ...safeUser,
        profile,
        verification,
      },
      null,
    );
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException(messages.auth.unauthorized);
    }

    const payload = this.tokenService.verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new UnauthorizedException(messages.auth.unauthorized);
    }

    const user = await this.userModel.findByPk(payload.id);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(messages.auth.unauthorized);
    }

    const valid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!valid) {
      throw new UnauthorizedException(messages.auth.unauthorized);
    }

    const accessToken = this.tokenService.generateAccessToken({
      id: user.id,
      role: user.role,
    });

    res.cookie('token', accessToken, this.getCookieOptions());

    return response(null, 'Access token refreshed successfully.');
  }
}
