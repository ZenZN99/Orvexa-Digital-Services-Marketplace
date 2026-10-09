import { Socket } from 'socket.io';
import { NotificationService } from '../../modules/notifications/notification.service.js';
export declare class NotificationSocketGateway {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    handleMarkAsRead(client: Socket, data: {
        notificationId: string;
    }): Promise<{
        message: string | null;
        data: any;
    } | undefined>;
}
