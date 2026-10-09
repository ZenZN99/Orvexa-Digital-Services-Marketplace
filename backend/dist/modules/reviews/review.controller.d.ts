import { ReviewService } from './review.service.js';
import type { RequestWithUser } from '../../types/express.js';
import { CreateReviewDTO } from './dto/create.js';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(req: RequestWithUser, contractId: string, data: CreateReviewDTO): Promise<{
        message: string | null;
        data: any;
    }>;
    findMe(req: RequestWithUser, page: string, limit: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findByFreelancer(freelancerId: string, page: string, limit: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findAllByService(serviceId: string, page: string, limit: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(reviewId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
