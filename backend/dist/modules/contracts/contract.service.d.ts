import { Contract } from './schema/contract.schema.js';
import { User } from '../users/schema/user.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { PlatformWallet } from '../platform-wallets/schema/platform-wallet.schema.js';
import { NotificationService } from '../notifications/notification.service.js';
import { RedisHelper } from '../../infrastructure/database/redis/redis.helper.js';
import { Sequelize } from 'sequelize-typescript';
import { Order } from '../orders/schema/order.schema.js';
export declare class ContractService {
    private readonly contractModel;
    private readonly userModel;
    private readonly freelancerModel;
    private readonly orderModel;
    private readonly serviceModel;
    private readonly platformWalletModel;
    private readonly sequelize;
    private readonly notificationService;
    private readonly redis;
    constructor(contractModel: typeof Contract, userModel: typeof User, freelancerModel: typeof Freelancer, orderModel: typeof Order, serviceModel: typeof Service, platformWalletModel: typeof PlatformWallet, sequelize: Sequelize, notificationService: NotificationService, redis: RedisHelper);
    findMe(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(userId: string, contractId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        message: string | null;
        data: any;
    }>;
    expire(contractId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    complete(userId: string, contractId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    deliver(userId: string, contractId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
