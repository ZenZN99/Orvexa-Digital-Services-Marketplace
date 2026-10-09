import { RedisService } from './redis.service.js';
export declare class RedisHelper {
    private readonly redisService;
    constructor(redisService: RedisService);
    private get redis();
    get(key: string): Promise<string | null>;
    set(key: string, value: any, ttlSeconds?: number): Promise<"OK">;
    del(key: string): Promise<number>;
    incr(key: string): Promise<number>;
    decr(key: string): Promise<number>;
    lpush(key: string, value: any): Promise<number>;
    lrange(key: string, start?: number, stop?: number): Promise<string[]>;
    ltrim(key: string, start?: number, stop?: number): Promise<"OK">;
    lrem(key: string, value: any): Promise<number>;
    getJSON<T>(key: string): Promise<T | null>;
}
