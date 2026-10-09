import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    sendNotification(notification: {
        id: string;
        receiverId: string;
        [key: string]: any;
    }): void;
    sendMarkAsRead(receiverId: string, notificationId: string): void;
    sendMarkAllAsRead(receiverId: string): void;
}
