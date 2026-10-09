import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redis!: Redis;

  onModuleInit() {
    const url = process.env.REDIS_URL;

    if (!url) {
      throw new Error('REDIS_URL is not defined');
    }

    this.redis = new Redis(url);
  }

  getClient(): Redis {
    return this.redis;
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
