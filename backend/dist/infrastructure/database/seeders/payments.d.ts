import { PaymentStatus } from '../../../common/enums/payment.enum.js';
import { Order } from '../../../modules/orders/schema/order.schema.js';
export declare const generatePayments: (createdOrders: Order[]) => {
    orderId: string;
    userId: string;
    amount: number;
    status: PaymentStatus;
    paidAt: Date | null;
}[];
