import { SupportConversation } from './schema/support-conversation.schema.js';
import { User } from '../../users/schema/user.schema.js';
export declare class SupportConversationService {
    private readonly supportConversationModel;
    private readonly userModel;
    constructor(supportConversationModel: typeof SupportConversation, userModel: typeof User);
    create(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findMe(userId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findOne(userId: string, conversationId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        message: string | null;
        data: any;
    }>;
    toggle(adminId: string, conversationId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
