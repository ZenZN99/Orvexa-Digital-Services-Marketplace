import { Model } from 'sequelize-typescript';
import { User } from '../../users/schema/user.schema.js';
import { Order } from '../../orders/schema/order.schema.js';
import { PaymentStatus } from '../../../common/enums/payment.enum.js';
export declare class Payment extends Model {
    id: string;
    orderId: string;
    order: Order;
    userId: string;
    user: User;
    amount: number;
    status: PaymentStatus;
    paidAt: Date | null;
}
