import { Queue, Worker, type JobsOptions } from "bullmq";
import type { Redis } from "ioredis";
import type { ContractsService } from "../contracts.service";

export class ContractQueue {
  private readonly queue: Queue;
  private readonly worker: Worker;

  constructor(
    private readonly contractsService: ContractsService,
    redis: Redis,
  ) {
    this.queue = new Queue("contracts", {
      connection: redis,
    });

    this.worker = new Worker(
      "contracts",
      async (job) => {
        switch (job.name) {
          case "expire-contract":
            return this.contractsService.expireContract(job.data.contractId); 

          default:
            throw new Error(`Unknown job: ${job.name}`);
        }
      },
      {
        connection: redis,
        concurrency: 10,
        limiter: {
          max: 20,
          duration: 1000,
        },
      },
    );
  }

  async add(name: string, data: { contractId: string }, options?: JobsOptions) {
    return this.queue.add(name, data, options);
  }

  async close(): Promise<void> {
    await Promise.all([this.queue.close(), this.worker.close()]);
  }
}
