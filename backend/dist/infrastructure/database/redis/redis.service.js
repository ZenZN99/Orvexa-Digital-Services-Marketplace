var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
let RedisService = class RedisService {
    redis;
    onModuleInit() {
        const url = process.env.REDIS_URL;
        if (!url) {
            throw new Error('REDIS_URL is not defined');
        }
        this.redis = new Redis(url);
    }
    getClient() {
        return this.redis;
    }
    async onModuleDestroy() {
        await this.redis.quit();
    }
};
RedisService = __decorate([
    Injectable()
], RedisService);
export { RedisService };
//# sourceMappingURL=redis.service.js.map