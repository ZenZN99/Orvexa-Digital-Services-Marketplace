import { FreelancerService } from './freelancer.service.js';
import type { RequestWithUser } from '../../../types/express.js';
import { UpdateFreelancerDTO } from './dto/update.js';
export declare class FreelancerController {
    private readonly freelancerService;
    constructor(freelancerService: FreelancerService);
    findMe(req: RequestWithUser): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    update(req: RequestWithUser, data: UpdateFreelancerDTO): Promise<{
        message: string | null;
        data: any;
    }>;
}
