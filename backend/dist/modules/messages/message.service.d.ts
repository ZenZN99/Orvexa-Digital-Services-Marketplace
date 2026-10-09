import { Message } from './schema/message.schema.js';
import { Contract } from '../contracts/schema/contract.schema.js';
import { User } from '../users/schema/user.schema.js';
import { CloudinaryService } from '../../infrastructure/cloudinary/cloudinary.service.js';
import { NotificationService } from '../notifications/notification.service.js';
import { MessageGateway } from '../../infrastructure/gateways/message.gateway.js';
export declare class MessageService {
    private readonly messageModel;
    private readonly contractModel;
    private readonly cloudinaryService;
    private readonly notificationService;
    private readonly messageGateway;
    constructor(messageModel: typeof Message, contractModel: typeof Contract, cloudinaryService: CloudinaryService, notificationService: NotificationService, messageGateway: MessageGateway);
    create(userId: string, contractId: string, content: string | null, images?: Express.Multer.File[]): Promise<{
        message: string | null;
        data: any;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        message: string | null;
        data: any;
    }>;
    findMe(userId: string, contractId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    destroy(currentUser: User, messageId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
