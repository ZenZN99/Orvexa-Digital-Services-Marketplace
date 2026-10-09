import { OrderStatus } from '../../../common/enums/order.enum.js';
import { PaymentStatus } from '../../../common/enums/payment.enum.js';
export const generatePayments = (createdOrders) => {
    return createdOrders.map((order, index) => {
        const isPending = order.status === OrderStatus.PENDING_PAYMENT;
        const isRefunded = order.status === OrderStatus.REFUNDED;
        const isFailed = index % 20 === 0;
        let status = PaymentStatus.COMPLETED;
        if (isPending) {
            status = PaymentStatus.PENDING;
        }
        else if (isRefunded) {
            status = PaymentStatus.REFUNDED;
        }
        else if (isFailed) {
            status = PaymentStatus.FAILED;
        }
        return {
            orderId: order.id,
            userId: order.clientId,
            amount: order.totalAmount,
            status,
            paidAt: status === PaymentStatus.COMPLETED || status === PaymentStatus.REFUNDED
                ? new Date()
                : null,
        };
    });
};
//# sourceMappingURL=payments.js.map