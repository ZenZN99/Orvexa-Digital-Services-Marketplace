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
import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { PlatformWallet } from './schema/platform-wallet.schema.js';
import { User } from '../users/schema/user.schema.js';
import { UserRole } from '../../common/enums/user.enum.js';
import { response } from '../../common/libs/response.js';
import { messages } from '../../common/libs/messages.js';
let PlatformWalletService = class PlatformWalletService {
    platformWalletModel;
    userModel;
    sequelize;
    constructor(platformWalletModel, userModel, sequelize) {
        this.platformWalletModel = platformWalletModel;
        this.userModel = userModel;
        this.sequelize = sequelize;
    }
    async findBalance() {
        const wallet = await this.platformWalletModel.findOne();
        if (!wallet) {
            throw new NotFoundException(messages.platformWallet.notFound);
        }
        return response({
            balance: Number(wallet.balance),
        }, null);
    }
    async withdraw(adminId, amount) {
        const transaction = await this.sequelize.transaction();
        try {
            const wallet = await this.platformWalletModel.findOne({
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!wallet) {
                throw new NotFoundException(messages.platformWallet.notFound);
            }
            const admin = await this.userModel.findOne({
                where: {
                    id: adminId,
                    role: UserRole.ADMIN,
                },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!admin) {
                throw new NotFoundException(messages.user.adminNotFound);
            }
            const walletBalance = Number(wallet.balance);
            if (walletBalance < amount) {
                throw new BadRequestException(messages.platformWallet.withdraw.insufficientBalance);
            }
            wallet.balance = walletBalance - amount;
            await wallet.save({
                transaction,
            });
            admin.balance = Number(admin.balance) + amount;
            await admin.save({
                transaction,
            });
            await transaction.commit();
            return response({
                amount,
                platformBalance: Number(wallet.balance),
                adminBalance: Number(admin.balance),
            }, messages.platformWallet.withdraw.success);
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
};
PlatformWalletService = __decorate([
    Injectable(),
    __param(0, InjectModel(PlatformWallet)),
    __param(1, InjectModel(User)),
    __metadata("design:paramtypes", [Object, Object, Sequelize])
], PlatformWalletService);
export { PlatformWalletService };
//# sourceMappingURL=platform-wallet.service.js.map