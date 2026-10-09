import { PlatformWalletService } from './platform-wallet.service.js';
import type { RequestWithUser } from '../../types/express.js';
export declare class PlatformWalletController {
    private readonly platformWalletService;
    constructor(platformWalletService: PlatformWalletService);
    findBalance(): Promise<{
        message: string | null;
        data: any;
    }>;
    withdraw(req: RequestWithUser, amount: number): Promise<{
        message: string | null;
        data: any;
    }>;
}
