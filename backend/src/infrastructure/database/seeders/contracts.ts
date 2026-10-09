import { ContractStatus } from '../../../common/enums/contract.enum.js';
import { OrderStatus } from '../../../common/enums/order.enum.js';
import { Order } from '../../../modules/orders/schema/order.schema.js';

const contractStatuses = [
  ContractStatus.IN_PROGRESS,
  ContractStatus.DELIVERED,
  ContractStatus.COMPLETED,
  ContractStatus.CANCELLED,
  ContractStatus.EXPIRED,
];

export const generateContracts = (createdOrders: Order[]) => {
  const validOrders = createdOrders.filter(
    (order) =>
      order.status !== OrderStatus.PENDING_PAYMENT && order.services.length > 0,
  );

  return validOrders.map((order, index) => {
    const service = order.services[0];

    const status = contractStatuses[index % contractStatuses.length];

    const deliveryDays = service.deliveryDays;

    const createdAt = new Date();

    const deadline = new Date(createdAt);
    deadline.setDate(deadline.getDate() + deliveryDays);

    const deliveredAt =
      status === ContractStatus.DELIVERED || status === ContractStatus.COMPLETED
        ? new Date(
            createdAt.getTime() +
              Math.floor((deadline.getTime() - createdAt.getTime()) * 0.8),
          )
        : null;

    const completedAt = status === ContractStatus.COMPLETED ? new Date() : null;

    const cancelledAt = status === ContractStatus.CANCELLED ? new Date() : null;

    return {
      orderId: order.id,
      serviceId: service.id,
      freelancerId: service.freelancer.id,
      clientId: order.clientId,
      amount: service.price,
      deliveryDays,
      deadline,
      status,
      deliveredAt,
      completedAt,
      cancelledAt,
      cancellationReason:
        status === ContractStatus.CANCELLED
          ? 'The contract was cancelled by the client.'
          : null,
    };
  });
};
