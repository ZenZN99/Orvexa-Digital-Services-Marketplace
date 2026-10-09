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

// Add user socket
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

// Remove socket
const removeUser = (socketId: string) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

// Get all sockets for user
const getUsers = (userId: string) => {
  return onlineUsers.filter((user) => user.userId === userId);
};

@WebSocketGateway({
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  // =========================
  // Connection
  // =========================

  handleConnection(client: Socket) {
    const user = client.data.user;

    if (!user) {
      client.disconnect();
      return;
    }

    addUser(user.id, client.id);

    console.log('🟢 Message socket connected:', user.id);

    console.log('📊 Online users:', onlineUsers);
  }

  // =========================
  // Disconnect
  // =========================

  handleDisconnect(client: Socket) {
    removeUser(client.id);

    console.log('🔴 Message socket disconnected:', client.id);

    console.log('📊 Online users:', onlineUsers);
  }

  // =========================
  // Send message
  // =========================

  sendMessage(data: { receiverId: string; message: any }) {
    const receivers = getUsers(data.receiverId);

    console.log('📤 Sending message to:', data.receiverId);

    console.log('📡 Active sockets:', receivers);

    if (!receivers.length) {
      console.log('⚠️ User is offline');

      return;
    }

    receivers.forEach((user) => {
      this.server.to(user.socketId).emit('receive-message', data.message);
    });
  }

  // =========================
  // Message deleted
  // =========================

  sendMessageDeleted(data: { receiverId: string; messageId: string }) {
    const receivers = getUsers(data.receiverId);

    console.log('🗑️ Sending message deletion to:', data.receiverId);

    receivers.forEach((user) => {
      this.server.to(user.socketId).emit('message-deleted', {
        messageId: data.messageId,
      });
    });
  }
}
