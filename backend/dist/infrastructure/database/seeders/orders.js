import { OrderStatus } from '../../../common/enums/order.enum.js';
import { UserRole } from '../../../common/enums/user.enum.js';
export const generateOrders = (createdUsers, createdServices) => {
    const clients = createdUsers.filter((user) => user.role === UserRole.CLIENT);
    const orders = [];
    const orderStatuses = [
        OrderStatus.PENDING_PAYMENT,
        OrderStatus.DISPUTED,
        OrderStatus.IN_PROGRESS,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
        OrderStatus.REFUNDED,
    ];
    const servicesPerOrder = 1;
    for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        const orderCount = 1 + (i % 3);
        for (let j = 0; j < orderCount; j++) {
            const orderIndex = i * orderCount + j;
            const selectedServices = [];
            for (let k = 0; k < servicesPerOrder; k++) {
                const service = createdServices[(orderIndex + k) % createdServices.length];
                if (!service) {
                    continue;
                }
                selectedServices.push({
                    id: service.id,
                    title: service.title,
                    description: service.description,
                    price: Number(service.price),
                    deliveryDays: service.deliveryDays,
                    images: service.images,
                    freelancer: {
                        id: service.freelancerId,
                        user: {
                            id: '',
                            firstName: '',
                            lastName: '',
                            profile: {
                                avatar: null,
                            },
                        },
                    },
                });
            }
            const totalAmount = selectedServices.reduce((total, service) => total + service.price, 0);
            orders.push({
                clientId: client.id,
                totalAmount,
                status: orderStatuses[orderIndex % orderStatuses.length],
                services: selectedServices,
            });
        }
    }
    return orders;
};
//# sourceMappingURL=orders.js.map