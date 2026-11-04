import { CookieManager, type SameSite } from '@riser-bob/cookie';
import type { TokenManager } from '../../config/token/token';
import { sanitizeUser } from '../../utilities/sanitize-user';
import type { FreelancerSchema } from '../freelancers/schemas/freelancer.schema';
import type { UserProfileSchema } from '../user-profiles/schemas/user-profile.schema';
import type { UserVerificationSchema } from '../user-verifications/schemas/user-verification.schema';
import { UserRole } from '../users/schemas/enums/users.enum';
import type {
  AuthenticationUser,
  UserSchema,
} from '../users/schemas/user.schema';
import { Validator, type SpongRequest } from 'riser-bob';
import { RgisterRule } from './rules/register.rule';
import bcrypt from 'bcryptjs';
import { JobTitle } from '../freelancers/schemas/enums/freelancers.enum';
import { LoginRule } from './rules/login.rule';

export class AuthService {
  constructor(
    private readonly userSchema: typeof UserSchema,
    private readonly userProfileSchema: typeof UserProfileSchema,
    private readonly freelancerSchema: typeof FreelancerSchema,
    private readonly userVerificationSchema: typeof UserVerificationSchema,
    private readonly tokenManager: TokenManager,
  ) {}

  private getCookieOptions(isLogout = false) {
    return {
      httpOnly: true,
      secure: true, // production : true // localhost: false
      sameSite: 'none' as SameSite, // production : none // localhost: lax
      maxAge: isLogout ? 0 : 365 * 24 * 60 * 60 * 1000,
    };
  }

  private getRefreshCookieOptions() {
    return {
      httpOnly: true,
      secure: true, // production : true // localhost: false
      sameSite: 'none' as SameSite, // production : none // localhost: lax
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    };
  }

  async register(
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role: UserRole;
    },
    spongReq: SpongRequest,
  ) {
    const validation = Validator.validate(body, RgisterRule);

    if (!validation.valid) {
      return {
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors: validation.errors,
      } as const;
    }

    const { firstName, lastName, email, password, role } =
      validation.data as UserSchema;

    const exisitng = await this.userSchema.findOne({ where: { email } });

    if (exisitng) {
      return {
        error: true,
        statusCode: 400,
        message: 'Unable to complete registration',
      } as const;
    }

    const hashed = await bcrypt.hash(password, 12);

    const newUser = await this.userSchema.create({
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

    await this.userProfileSchema.create({
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
      await this.freelancerSchema.create({
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

    const accessToken = this.tokenManager.generateAccessToken({
      id: newUser.id,
      isActive: newUser.isActive,
      role: newUser.role,
    });

    const refreshToken = this.tokenManager.generateRefreshToken({
      id: newUser.id,
      isActive: newUser.isActive,
      role: newUser.role,
    });

    newUser.refreshToken = await bcrypt.hash(refreshToken, 12);
    await newUser.save();

    const cookies = CookieManager.fromRequest(spongReq.request);

    cookies.set('token', accessToken, this.getCookieOptions());
    cookies.set('refreshToken', refreshToken, this.getRefreshCookieOptions());

    const safeUser = sanitizeUser(newUser);

    const response = new Response(
      JSON.stringify({
        success: true,
        message: 'Account created successfully',
        data: safeUser,
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return cookies.applyTo(response);
  }

  async login(
    body: { email: string; password: string },
    spongReq: SpongRequest,
  ) {
    const validation = Validator.validate(body, LoginRule);

    if (!validation.valid) {
      return {
        error: true,
        statusCode: 422,
        message: 'Validation failed',
        errors: validation.errors,
      } as const;
    }

    const { email, password } = validation.data as UserSchema;

    const user = await this.userSchema.findOne({ where: { email } });

    if (!user) {
      return {
        error: true,
        statusCode: 400,
        message: 'Invalid email or password',
      } as const;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        error: true,
        statusCode: 400,
        message: 'Invalid email or password',
      } as const;
    }

    const accessToken = this.tokenManager.generateAccessToken({
      id: user.id,
      isActive: user.isActive,
      role: user.role,
    });

    const refreshToken = this.tokenManager.generateRefreshToken({
      id: user.id,
      isActive: user.isActive,
      role: user.role,
    });

    user.refreshToken = await bcrypt.hash(refreshToken, 12);

    user.lastLoginAt = new Date();
    await user.save();

    const cookies = CookieManager.fromRequest(spongReq.request);

    cookies.set('token', accessToken, this.getCookieOptions());
    cookies.set('refreshToken', refreshToken, this.getRefreshCookieOptions());

    const response = new Response(
      JSON.stringify({
        success: true,
        message: 'Logged in successfully',
        data: user,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return cookies.applyTo(response);
  }

  async logout(spongReq: SpongRequest) {
    const cookies = CookieManager.fromRequest(spongReq.request);

    cookies.delete('token', this.getCookieOptions(true));
    cookies.delete('refreshToken', this.getRefreshCookieOptions());

    const response = new Response(
      JSON.stringify({
        success: true,
        message: 'Logged out successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return cookies.applyTo(response);
  }

  async me(currentUser: AuthenticationUser) {
    const user = await this.userSchema.findByPk(currentUser.id);

    if (!user) {
      throw new Error('User not found');
    }

    const profile = await this.userProfileSchema.findOne({
      where: {
        userId: user.id,
      },
      attributes: ['id', 'avatar', 'cover', 'bio'],
    });

    const verification = await this.userVerificationSchema.findOne({
      where: {
        userId: user.id,
      },
      attributes: ['id', 'status', 'submittedAt', 'rejectionReason'],
    });

    return {
      success: true,
      data: {
        ...sanitizeUser(user),
        profile,
        verification,
      },
    };
  }
  async refreshToken(spongReq: SpongRequest) {
    const cookies = CookieManager.fromRequest(spongReq.request);

    const refreshToken = cookies.get('refreshToken');

    if (!refreshToken) {
      return {
        error: true,
        message: 'You are not authenticated',
      } as const;
    }

    const payload = this.tokenManager.verifyRefreshToken(refreshToken);

    if (!payload) {
      return {
        error: true,
        message: 'You are not authenticated',
      } as const;
    }

    const user = await this.userSchema.findByPk(payload.id);

    if (!user || !user.refreshToken) {
      return {
        error: true,
        message: 'You are not authenticated',
      } as const;
    }

    const valid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!valid) {
      return {
        error: true,
        message: 'You are not authenticated',
      } as const;
    }

    const accessToken = this.tokenManager.generateAccessToken({
      id: user.id,
      isActive: user.isActive,
      role: user.role,
    });

    cookies.set('token', accessToken, this.getCookieOptions());

    const response = new Response(
      JSON.stringify({
        success: true,
        message: 'Access token refreshed successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return cookies.applyTo(response);
  }
}
