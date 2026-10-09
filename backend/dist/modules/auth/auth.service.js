var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException, ConflictException, Injectable, UnauthorizedException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/schema/user.schema.js';
import { TokenService } from '../../infrastructure/token/token.service.js';
import { messages } from '../../common/libs/messages.js';
import bcrypt from 'bcryptjs';
import { UserRole } from '../../common/enums/user.enum.js';
import { sanitizeUser } from '../../common/libs/sanitize-user.js';
import { response } from '../../common/libs/response.js';
import { UserProfile } from '../profiles/user-profiles/schema/user-profile.schema.js';
import { RedisHelper } from '../../infrastructure/database/redis/redis.helper.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { JobTitle } from '../../common/enums/freelancer.enum.js';
import { UserVerification } from '../user-verifications/schema/user-verification.schema.js';
let AuthService = class AuthService {
    userModel;
    userProfileModel;
    userVerificationModel;
    freelancerModel;
    tokenService;
    redis;
    constructor(userModel, userProfileModel, userVerificationModel, freelancerModel, tokenService, redis) {
        this.userModel = userModel;
        this.userProfileModel = userProfileModel;
        this.userVerificationModel = userVerificationModel;
        this.freelancerModel = freelancerModel;
        this.tokenService = tokenService;
        this.redis = redis;
    }
    getCookieOptions(isLogout = false) {
        return {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: isLogout ? 0 : 365 * 24 * 60 * 60 * 1000,
        };
    }
    getRefreshCookieOptions() {
        return {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        };
    }
    async register(data, res) {
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
    async login(data, res) {
        const { email, password } = data;
        const key = `auth:login:attempts:${email.toLowerCase().trim()}`;
        const attempts = await this.redis.get(key);
        if (attempts && Number(attempts) >= 5) {
            throw new UnauthorizedException('Too many login attempts. Please try again later.');
        }
        const user = await this.userModel.findOne({
            where: { email },
        });
        if (!user) {
            const currentAttempts = await this.redis.incr(key);
            if (currentAttempts === 1) {
                await this.redis.set(key, currentAttempts, 15 * 60);
            }
            throw new BadRequestException(messages.auth.login.failed);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const currentAttempts = await this.redis.incr(key);
            if (currentAttempts === 1) {
                await this.redis.set(key, currentAttempts, 15 * 60);
            }
            throw new BadRequestException(messages.auth.login.failed);
        }
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
    async logout(res, userId) {
        const user = await this.userModel.findByPk(userId);
        if (!user) {
            throw new UnauthorizedException(messages.auth.me.notFound);
        }
        res.clearCookie('token', this.getCookieOptions(true));
        res.clearCookie('refreshToken', this.getRefreshCookieOptions());
        return response(null, messages.auth.logout.success);
    }
    async me(userId) {
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
        return response({
            ...safeUser,
            profile,
            verification,
        }, null);
    }
    async refreshToken(req, res) {
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
};
AuthService = __decorate([
    Injectable(),
    __param(0, InjectModel(User)),
    __param(1, InjectModel(UserProfile)),
    __param(2, InjectModel(UserVerification)),
    __param(3, InjectModel(Freelancer)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, TokenService,
        RedisHelper])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map