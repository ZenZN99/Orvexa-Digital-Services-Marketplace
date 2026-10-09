import { Freelancer } from './schema/freelancer.schema.js';
import { UpdateFreelancerDTO } from './dto/update.js';
export declare class FreelancerService {
    private readonly freelancerModel;
    constructor(freelancerModel: typeof Freelancer);
    findMe(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    update(userId: string, data: UpdateFreelancerDTO): Promise<{
        message: string | null;
        data: any;
    }>;
}
