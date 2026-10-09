import { ContractService } from './contract.service.js';
import type { RequestWithUser } from '../../types/express.js';
export declare class ContractController {
    private readonly contractService;
    constructor(contractService: ContractService);
    findMe(req: RequestWithUser): Promise<{
        message: string | null;
        data: any;
    }>;
    findAll(page: string, limit: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(req: RequestWithUser, contractId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    complete(req: RequestWithUser, contractId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    deliver(req: RequestWithUser, contractId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
