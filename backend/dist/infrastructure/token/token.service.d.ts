import { ConfigService } from '@nestjs/config';
export interface TokenPayload {
    id: string;
    role?: string;
}
export declare class TokenService {
    private configService;
    constructor(configService: ConfigService);
    generateAccessToken(payload: TokenPayload): string;
    generateRefreshToken(payload: TokenPayload): string;
    verifyAccessToken(token: string): TokenPayload | null;
    verifyRefreshToken(token: string): TokenPayload | null;
}
