import { OrderService } from './order.service.js';
import type { RequestWithUser } from '../../types/express.js';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(req: RequestWithUser): Promise<{
        message: string | null;
        data: any;
    }>;
    findAll(page: string, limit: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findMe(req: RequestWithUser): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(req: RequestWithUser, orderId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    destroy(req: RequestWithUser, orderId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
