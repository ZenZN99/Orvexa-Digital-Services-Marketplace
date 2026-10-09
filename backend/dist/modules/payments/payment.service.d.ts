import { Sequelize } from 'sequelize-typescript';
import { Payment } from './schema/payment.schema.js';
import { Order } from '../orders/schema/order.schema.js';
import { User } from '../users/schema/user.schema.js';
import { Contract } from '../contracts/schema/contract.schema.js';
import { Service } from '../services/schema/service.schema.js';
import { Queue } from 'bullmq';
import { NotificationService } from '../notifications/notification.service.js';
export declare class PaymentService {
    private readonly paymentModel;
    private readonly orderModel;
    private readonly userModel;
    private readonly serviceModel;
    private readonly contractModel;
    private readonly contractQueue;
    private readonly notificationService;
    private readonly sequelize;
    constructor(paymentModel: typeof Payment, orderModel: typeof Order, userModel: typeof User, serviceModel: typeof Service, contractModel: typeof Contract, contractQueue: Queue, notificationService: NotificationService, sequelize: Sequelize);
    pay(userId: string, orderId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        message: string | null;
        data: any;
    }>;
    findMe(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(userId: string, paymentId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    rechargeBalance(userId: string, amount: number): Promise<{
        message: string | null;
        data: any;
    }>;
}
