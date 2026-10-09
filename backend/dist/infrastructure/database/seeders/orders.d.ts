import { OrderStatus } from '../../../common/enums/order.enum.js';
import { Service } from '../../../modules/services/schema/service.schema.js';
import { User } from '../../../modules/users/schema/user.schema.js';
export declare const generateOrders: (createdUsers: User[], createdServices: Service[]) => {
    clientId: string;
    totalAmount: number;
    status: OrderStatus;
    services: {
        id: string;
        title: string;
        description: string;
        price: number;
        deliveryDays: number;
        images: {
            url: string;
            publicId: string;
        }[];
        freelancer: {
            id: string;
            user: {
                id: string;
                firstName: string;
                lastName: string;
                profile: {
                    avatar: null;
                };
            };
        };
    }[];
}[];
