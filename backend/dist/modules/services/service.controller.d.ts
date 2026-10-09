import { ServiceService } from './service.service.js';
import type { RequestWithUser } from '../../types/express.js';
import { CreateServiceDTO } from './dto/create.js';
import { ServiceStatus } from '../../common/enums/service.enum.js';
import { UpdateServiceDTO } from './dto/update.js';
export declare class ServiceController {
    private readonly serviceService;
    constructor(serviceService: ServiceService);
    create(req: RequestWithUser, data: CreateServiceDTO, images: Express.Multer.File[]): Promise<{
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
    findByFreelancer(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findPending(page: string, limit: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(serviceId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    update(req: RequestWithUser, serviceId: string, data: UpdateServiceDTO, images: Express.Multer.File[]): Promise<{
        message: string | null;
        data: any;
    }>;
    updateStatus(serviceId: string, req: RequestWithUser, status: ServiceStatus, reason?: string): Promise<{
        message: string | null;
        data: any;
    }>;
    destroy(req: RequestWithUser, serviceId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
