import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    sendMessage(data: {
        receiverId: string;
        message: any;
    }): void;
    sendMessageDeleted(data: {
        receiverId: string;
        messageId: string;
    }): void;
}
