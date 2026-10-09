import { SupportMessageService } from './support-message.service.js';
import type { RequestWithUser } from '../../../types/express.js';
export declare class SupportMessageController {
    private readonly supportMessageService;
    constructor(supportMessageService: SupportMessageService);
    create(req: RequestWithUser, conversationId: string, message: string | null, files: Express.Multer.File[]): Promise<{
        message: string | null;
        data: any;
    }>;
    findAll(req: RequestWithUser, conversationId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    markAllAsRead(req: RequestWithUser, conversationId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    destroy(conversationId: string, messageId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
