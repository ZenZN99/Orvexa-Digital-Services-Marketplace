import { Review } from './schema/review.schema.js';
import { Contract } from '../contracts/schema/contract.schema.js';
import { Payment } from '../payments/schema/payment.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { User } from '../users/schema/user.schema.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { CreateReviewDTO } from './dto/create.js';
import { Sequelize } from 'sequelize-typescript';
import { NotificationService } from '../notifications/notification.service.js';
import { RedisHelper } from '../../infrastructure/database/redis/redis.helper.js';
export declare class ReviewService {
    private readonly reviewModel;
    private readonly contractModel;
    private readonly userModel;
    private readonly paymentModel;
    private readonly serviceModel;
    private readonly freelancerModel;
    private readonly notificationService;
    private readonly redis;
    private readonly sequelize;
    constructor(reviewModel: typeof Review, contractModel: typeof Contract, userModel: typeof User, paymentModel: typeof Payment, serviceModel: typeof Service, freelancerModel: typeof Freelancer, notificationService: NotificationService, redis: RedisHelper, sequelize: Sequelize);
    create(clientId: string, contractId: string, data: CreateReviewDTO): Promise<{
        message: string | null;
        data: any;
    }>;
    findMe(userId: string, page?: number, limit?: number): Promise<{
        message: string | null;
        data: any;
    }>;
    findByFreelancer(userId: string, page?: number, limit?: number): Promise<{
        message: string | null;
        data: any;
    }>;
    findAllByService(serviceId: string, page?: number, limit?: number): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(id: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
