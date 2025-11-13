import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import process from 'node:process';
import { CloudflareConfig } from './cloudflare-config.type';
import validateConfig from '@/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  CLOUDFLARE_R2_ACCOUNT_ID: string;

  @IsString()
  CLOUDFLARE_R2_BUCKET_NAME: string;

  @IsString()
  CLOUDFLARE_R2_PUBLIC_BUCKET_URL: string;

  @IsString()
  CLOUDFLARE_R2_TOKEN_VALUE: string;

  @IsString()
  CLOUDFLARE_R2_ACCESS_KEY_ID: string;

  @IsString()
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: string;
}

export default registerAs<CloudflareConfig>('cloudflare', () => {
  console.info(`Register CloudflareConfig from environment variables`);
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    r2AccountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID!,
    r2BucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
    r2PublicBucketUrl: process.env.CLOUDFLARE_R2_PUBLIC_BUCKET_URL!,
    r2TokenValue: process.env.CLOUDFLARE_R2_TOKEN_VALUE!,
    r2AccessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    r2SecretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  };
});
