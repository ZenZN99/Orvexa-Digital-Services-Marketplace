import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { ContractService } from './contract.service.js';

@Processor('contracts', {
  concurrency: 10,
  limiter: {
    max: 20,
    duration: 1000,
  },
})
export class ContractProcessor extends WorkerHost {
  constructor(private readonly contractService: ContractService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'expire-contract':
        return this.contractService.expire(job.data.contractId);

      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  }
}
