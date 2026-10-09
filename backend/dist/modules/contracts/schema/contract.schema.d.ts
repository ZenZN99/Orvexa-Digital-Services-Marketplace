import { Model } from 'sequelize-typescript';
import { Order } from '../../orders/schema/order.schema.js';
import { Service } from '../../services/schema/service.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { ContractStatus } from '../../../common/enums/contract.enum.js';
import { Freelancer } from '../../profiles/freelancer/schema/freelancer.schema.js';
export declare class Contract extends Model {
    id: string;
    orderId: string;
    order: Order;
    serviceId: string;
    service: Service;
    freelancerId: string;
    freelancer: Freelancer;
    clientId: string;
    client: User;
    amount: number;
    deliveryDays: number;
    deadline: Date;
    status: ContractStatus;
    deliveredAt: Date | null;
    completedAt: Date | null;
    cancelledAt: Date | null;
    cancellationReason: string | null;
}
