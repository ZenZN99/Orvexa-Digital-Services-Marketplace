import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { INestApplication } from '@nestjs/common';
import { TokenService } from '../token/token.service.js';
export declare class AuthSocketAdapter extends IoAdapter {
    private tokenService;
    constructor(app: INestApplication, tokenService: TokenService);
    createIOServer(port: number, options?: any): Server;
}
