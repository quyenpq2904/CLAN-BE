import { DatabaseConfig } from '@/database/config/database-config.type';
import { AppConfig } from './app-config.type';
import { AuthConfig } from '@/api/auth/config/auth-config.type';
import { RedisConfig } from '@/redis/config/redis-config.type';
import { MailConfig } from '@/mail/config/mail-config.type';
import { CloudflareConfig } from '@/libs/cloudflare/config/cloudflare-config.type';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  mail: MailConfig;
  cloudflare: CloudflareConfig;
};
