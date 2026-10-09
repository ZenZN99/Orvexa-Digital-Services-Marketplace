import { CartService } from './cart.service.js';
import type { RequestWithUser } from '../../types/express.js';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    findMe(req: RequestWithUser): Promise<{
        message: string | null;
        data: any;
    }>;
    addItem(req: RequestWithUser, serviceId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    removeItem(req: RequestWithUser, serviceId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    clearCart(req: RequestWithUser): Promise<{
        message: string | null;
        data: any;
    }>;
}
