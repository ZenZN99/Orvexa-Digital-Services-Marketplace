import type { RequestWithUser } from '../../types/express.js';
import { MessageService } from './message.service.js';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    create(req: RequestWithUser, contractId: string, content: string, images: Express.Multer.File[]): Promise<{
        message: string | null;
        data: any;
    }>;
    findAll(page: string, limit: string): Promise<{
        message: string | null;
        data: any;
    }>;
    findMe(req: RequestWithUser, contractId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    destroy(req: RequestWithUser, messageId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
