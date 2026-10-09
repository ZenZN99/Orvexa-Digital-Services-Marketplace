import { SupportConversationService } from './support-conversation.service.js';
import type { RequestWithUser } from '../../../types/express.js';
export declare class SupportConversationController {
    private readonly supportConversationService;
    constructor(supportConversationService: SupportConversationService);
    create(req: RequestWithUser): Promise<{
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
    findOne(req: RequestWithUser, conversationId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    toggle(req: RequestWithUser, conversationId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
