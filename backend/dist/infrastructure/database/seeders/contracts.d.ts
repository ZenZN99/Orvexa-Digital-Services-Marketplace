import { ContractStatus } from '../../../common/enums/contract.enum.js';
import { Order } from '../../../modules/orders/schema/order.schema.js';
export declare const generateContracts: (createdOrders: Order[]) => {
    orderId: string;
    serviceId: string;
    freelancerId: string;
    clientId: string;
    amount: number;
    deliveryDays: number;
    deadline: Date;
    status: ContractStatus;
    deliveredAt: Date | null;
    completedAt: Date | null;
    cancelledAt: Date | null;
    cancellationReason: string | null;
}[];
