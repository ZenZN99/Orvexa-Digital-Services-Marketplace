import { Cart } from './schema/cart.schema.js';
import { CartItem } from './schema/cart-item.schema.js';
import { Service } from '../services/schema/service.schema.js';
export declare class CartService {
    private readonly cartModel;
    private readonly cartItemModel;
    private readonly serviceModel;
    constructor(cartModel: typeof Cart, cartItemModel: typeof CartItem, serviceModel: typeof Service);
    findMe(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    addItem(userId: string, serviceId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    removeItem(userId: string, serviceId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    clearCart(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
