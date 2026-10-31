import Redis from "ioredis";

export class RedisConfig {
  private redis: Redis | null = null;

  async connect(): Promise<void> {
    const url = process.env.REDIS_URL;

    if (!url) {
      throw new Error("REDIS_URL is not defined");
    }

    if (this.redis) return;

    const redis = new Redis(url, {
      maxRetriesPerRequest: null,
    });

    await redis.ping();
    this.redis = redis;
  }

  getClient(): Redis {
    if (!this.redis) {
      throw new Error("Redis has not been initialized");
    }

    return this.redis;
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
    }
  }
}
