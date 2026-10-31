import type { Server, Socket } from 'socket.io';
import * as cookie from 'cookie';
import type { TokenManager } from '../token/token';

export class AuthSocketAdapter {
  constructor(private readonly tokenManager: TokenManager) {}

  initialize(server: Server): Server {
    server.use((socket: Socket, next) => {
      try {
        const rawCookies = socket.handshake.headers.cookie;

        if (!rawCookies) {
          return next(new Error('Unauthorized: No cookies found'));
        }

        const parsedCookies = cookie.parseCookie(rawCookies);
        const token = parsedCookies.token;

        if (!token) {
          return next(new Error('Unauthorized'));
        }

        const payload = this.tokenManager.verifyAccessToken(token);
        socket.data.user = payload;

        next();
      } catch {
        next(new Error('Unauthorized'));
      }
    });

    return server;
  }
}
