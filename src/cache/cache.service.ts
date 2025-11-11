import { Inject, Injectable } from '@nestjs/common';
import { Cacheable } from 'cacheable';

@Injectable()
export class CacheService {
  constructor(@Inject('CACHE_INSTANCE') private readonly cache: Cacheable) {}

  async get<TData>(key: string): Promise<TData | undefined> {
    return await this.cache.get(key);
  }

  async set<TData>(
    key: string,
    value: TData,
    ttl?: number | string,
  ): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    await this.cache.delete(key);
  }
}
