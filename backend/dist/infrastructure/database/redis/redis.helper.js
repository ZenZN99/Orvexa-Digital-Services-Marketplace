var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service.js';
let RedisHelper = class RedisHelper {
    redisService;
    constructor(redisService) {
        this.redisService = redisService;
    }
    get redis() {
        return this.redisService.getClient();
    }
    async get(key) {
        return this.redis.get(key);
    }
    async set(key, value, ttlSeconds) {
        const data = typeof value === 'string' ? value : JSON.stringify(value);
        if (ttlSeconds !== undefined) {
            return this.redis.set(key, data, 'EX', ttlSeconds);
        }
        return this.redis.set(key, data);
    }
    async del(key) {
        return this.redis.del(key);
    }
    async incr(key) {
        return this.redis.incr(key);
    }
    async decr(key) {
        return this.redis.decr(key);
    }
    async lpush(key, value) {
        return this.redis.lpush(key, JSON.stringify(value));
    }
    async lrange(key, start = 0, stop = 19) {
        return this.redis.lrange(key, start, stop);
    }
    async ltrim(key, start = 0, stop = 19) {
        return this.redis.ltrim(key, start, stop);
    }
    async lrem(key, value) {
        return this.redis.lrem(key, 0, JSON.stringify(value));
    }
    async getJSON(key) {
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }
};
RedisHelper = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [RedisService])
], RedisHelper);
export { RedisHelper };
//# sourceMappingURL=redis.helper.js.map