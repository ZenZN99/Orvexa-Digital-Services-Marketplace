import { Notification } from './schema/notification.schema.js';
import { NotificationGateway } from '../../infrastructure/gateways/notification.gateway.js';
export declare class NotificationService {
    private readonly notificationModel;
    private readonly notificationGateway;
    constructor(notificationModel: typeof Notification, notificationGateway: NotificationGateway);
    create(data: Partial<Notification>): Promise<{
        message: string | null;
        data: any;
    } | undefined>;
    findMe(receiverId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    markAsRead(receiverId: string, notificationId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    markAllAsRead(receiverId: string): Promise<{
        message: string | null;
        data: any;
    }>;
    destroy(receiverId: string, notificationId: string): Promise<{
        message: string | null;
        data: any;
    }>;
}
