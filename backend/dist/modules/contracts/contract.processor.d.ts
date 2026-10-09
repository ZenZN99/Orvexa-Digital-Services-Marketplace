import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ContractService } from './contract.service.js';
export declare class ContractProcessor extends WorkerHost {
    private readonly contractService;
    constructor(contractService: ContractService);
    process(job: Job): Promise<{
        message: string | null;
        data: any;
    }>;
}
