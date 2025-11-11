import { createKeyv } from '@keyv/redis';
import { Global, Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const secondary = createKeyv('redis://103.163.24.150:6379', {
          namespace: 'keyv',
        });
        return new Cacheable({
          secondary,
          ttl: 60 * 60 * 24 * 30, // 30 days
        });
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
