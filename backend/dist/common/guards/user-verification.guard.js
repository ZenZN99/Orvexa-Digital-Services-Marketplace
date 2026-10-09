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
import { ForbiddenException, Injectable, } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserVerificationStatus } from '../enums/user-verification.enum.js';
import { messages } from '../libs/messages.js';
import { UserVerification } from '../../modules/user-verifications/schema/user-verification.schema.js';
let UserVerificationGuard = class UserVerificationGuard {
    userVerificationModel;
    constructor(userVerificationModel) {
        this.userVerificationModel = userVerificationModel;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userId = request.user.id;
        const verification = await this.userVerificationModel.findOne({
            where: {
                userId,
                status: UserVerificationStatus.APPROVED,
            },
        });
        if (!verification) {
            throw new ForbiddenException(messages.userVerification.required);
        }
        return true;
    }
};
UserVerificationGuard = __decorate([
    Injectable(),
    __param(0, InjectModel(UserVerification)),
    __metadata("design:paramtypes", [Object])
], UserVerificationGuard);
export { UserVerificationGuard };
//# sourceMappingURL=user-verification.guard.js.map