import { SupportMessage } from './schema/support-message.schema.js';
import { SupportConversation } from '../coversations/schema/support-conversation.schema.js';
import { User } from '../../users/schema/user.schema.js';
import { CloudinaryService } from '../../../infrastructure/cloudinary/cloudinary.service.js';
export declare class SupportMessageService {
    private readonly supportMessageModel;
    private readonly supportConversationModel;
    private readonly cloudinaryService;
    constructor(supportMessageModel: typeof SupportMessage, supportConversationModel: typeof SupportConversation, cloudinaryService: CloudinaryService);
    private authorizeConversation;
    create(currentUser: User, conversationId: string, message: string | null, files?: Express.Multer.File[]): Promise<{
        message: string | null;
        data: any;
    }>;
    findAll(currentUser: User, conversationId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    markAllAsRead(currentUser: User, conversationId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    destroy(conversationId: string, messageId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
