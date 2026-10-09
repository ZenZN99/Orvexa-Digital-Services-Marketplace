import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private redis;
    onModuleInit(): void;
    getClient(): Redis;
    onModuleDestroy(): Promise<void>;
}
