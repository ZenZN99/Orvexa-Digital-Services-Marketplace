import { Model } from 'sequelize-typescript';
import { User } from '../../users/schema/user.schema.js';
import { OrderStatus } from '../../../common/enums/order.enum.js';
export declare class Order extends Model {
    id: string;
    clientId: string;
    client: User;
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
                    avatar: {
                        url: string;
                        publicId: string;
                    } | null;
                };
            };
        };
    }[];
}
