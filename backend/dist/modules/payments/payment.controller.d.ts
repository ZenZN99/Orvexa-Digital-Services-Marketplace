import { PaymentService } from './payment.service.js';
import type { RequestWithUser } from '../../types/express.js';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    pay(req: RequestWithUser, orderId: string): Promise<{
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
    findOne(req: RequestWithUser, paymentId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    rechargeBalance(req: RequestWithUser, amount: number): Promise<{
        message: string | null;
        data: any;
    }>;
}
