import { Service } from './schema/service.schema.js';
import { CloudinaryService } from '../../infrastructure/cloudinary/cloudinary.service.js';
import { CreateServiceDTO } from './dto/create.js';
import { Freelancer } from '../profiles/freelancer/schema/freelancer.schema.js';
import { ServiceStatus } from '../../common/enums/service.enum.js';
import { User } from '../users/schema/user.schema.js';
import { UpdateServiceDTO } from './dto/update.js';
import { NotificationService } from '../notifications/notification.service.js';
import { RedisHelper } from '../../infrastructure/database/redis/redis.helper.js';
export declare class ServiceService {
    private readonly serviceModel;
    private readonly freelancerModel;
    private readonly userModel;
    private readonly cloudinaryService;
    private readonly notificationService;
    private readonly redis;
    constructor(serviceModel: typeof Service, freelancerModel: typeof Freelancer, userModel: typeof User, cloudinaryService: CloudinaryService, notificationService: NotificationService, redis: RedisHelper);
    create(userId: string, data: CreateServiceDTO, images: Express.Multer.File[]): Promise<{
        message: string | null;
        data: any;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        message: string | null;
        data: any;
    }>;
    findMe(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findByFreelancer(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(serviceId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findPending(page?: number, limit?: number): Promise<{
        message: string | null;
        data: any;
    }>;
    update(userId: string, serviceId: string, data: UpdateServiceDTO, images?: Express.Multer.File[]): Promise<{
        message: string | null;
        data: any;
    }>;
    updateStatus(serviceId: string, adminId: string, status: ServiceStatus, reason?: string): Promise<{
        message: string | null;
        data: any;
    }>;
    destroy(currentUser: User, serviceId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
