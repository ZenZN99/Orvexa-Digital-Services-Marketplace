import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service.js';
import { RedisHelper } from './redis.helper.js';

@Global()
@Module({
  providers: [RedisService, RedisHelper],
  exports: [RedisService, RedisHelper],
})
export class RedisModule {}
