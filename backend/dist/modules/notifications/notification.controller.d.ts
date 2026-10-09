import { NotificationService } from './notification.service.js';
import type { RequestWithUser } from '../../types/express.js';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findMe(req: RequestWithUser): Promise<{
        message: string | null;
        data: any;
    }>;
    markAsRead(req: RequestWithUser, notificationId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    markAllAsRead(req: RequestWithUser): Promise<{
        message: string | null;
        data: any;
    }>;
    destroy(req: RequestWithUser, notificationId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
