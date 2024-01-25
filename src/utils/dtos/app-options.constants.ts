import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const redisConfig = {
      socket: {
        host: configService.get<string>('REDIS_HOST', '127.0.0.1'),
        port: configService.get<number>('REDIS_PORT', 6379),
      },
    };

    const store = await redisStore(redisConfig);

    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
