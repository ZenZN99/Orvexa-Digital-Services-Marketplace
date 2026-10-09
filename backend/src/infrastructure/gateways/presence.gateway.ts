import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FRONTEND_URL } from '../../url.js';

interface OnlineUser {
  userId: string;
  socketId: string;
}

let onlineUsers: OnlineUser[] = [];

const addUser = (userId: string, socketId: string) => {
  const exists = onlineUsers.some(
    (user) => user.userId === userId && user.socketId === socketId,
  );

  if (!exists) {
    onlineUsers.push({
      userId,
      socketId,
    });
  }
};

const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getOnlineUserIds = () => {
  return [...new Set(onlineUsers.map((user) => user.userId))];
};

@WebSocketGateway({
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
})
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const user = client.data.user;

    if (!user) {
      client.disconnect();
      return;
    }

    addUser(user.id, client.id);

    console.log('🟢 Presence connected:', user.id);

    this.server.emit('online-users', getOnlineUserIds());
  }

  handleDisconnect(client: Socket) {
    removeUser(client.id);

    console.log('🔴 Presence disconnected:', client.id);

    this.server.emit('online-users', getOnlineUserIds());
  }
}
