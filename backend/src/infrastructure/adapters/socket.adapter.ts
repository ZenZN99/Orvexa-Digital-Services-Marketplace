import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, Socket } from 'socket.io';
import { INestApplication } from '@nestjs/common';
import * as cookie from 'cookie';
import { FRONTEND_URL } from '../../url.js';
import { TokenService } from '../token/token.service.js';

export class AuthSocketAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private tokenService: TokenService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: any): Server {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: FRONTEND_URL,
        credentials: true,
      },
    });

    server.use((socket: Socket, next) => {
      try {
        const rawCookies = socket.handshake.headers.cookie;

        if (!rawCookies) {
          return next(new Error('Unauthorized: No cookies found'));
        }

        const parsedCookies = cookie.parseCookie(rawCookies);

        const token = parsedCookies.token;

        if (!token) return next(new Error('Unauthorized'));

        const payload = this.tokenService.verifyAccessToken(token);
        socket.data.user = payload;

        next();
      } catch {
        next(new Error('Unauthorized'));
      }
    });

    return server;
  }
}
