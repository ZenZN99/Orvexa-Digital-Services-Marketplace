import { Order } from './schema/order.schema.js';
import { Cart } from '../carts/schema/cart.schema.js';
import { CartItem } from '../carts/schema/cart-item.schema.js';
import { Sequelize } from 'sequelize-typescript';
export declare class OrderService {
    private readonly orderModel;
    private readonly cartModel;
    private readonly cartItemModel;
    private readonly sequelize;
    constructor(orderModel: typeof Order, cartModel: typeof Cart, cartItemModel: typeof CartItem, sequelize: Sequelize);
    create(userId: string): Promise<{
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
    findOne(userId: string, orderId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    destroy(userId: string, orderId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
