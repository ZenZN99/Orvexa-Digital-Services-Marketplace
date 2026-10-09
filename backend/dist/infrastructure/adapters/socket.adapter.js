import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookie from 'cookie';
import { FRONTEND_URL } from '../../url.js';
export class AuthSocketAdapter extends IoAdapter {
    tokenService;
    constructor(app, tokenService) {
        super(app);
        this.tokenService = tokenService;
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, {
            ...options,
            cors: {
                origin: FRONTEND_URL,
                credentials: true,
            },
        });
        server.use((socket, next) => {
            try {
                const rawCookies = socket.handshake.headers.cookie;
                if (!rawCookies) {
                    return next(new Error('Unauthorized: No cookies found'));
                }
                const parsedCookies = cookie.parseCookie(rawCookies);
                const token = parsedCookies.token;
                if (!token)
                    return next(new Error('Unauthorized'));
                const payload = this.tokenService.verifyAccessToken(token);
                socket.data.user = payload;
                next();
            }
            catch {
                next(new Error('Unauthorized'));
            }
        });
        return server;
    }
}
//# sourceMappingURL=socket.adapter.js.map