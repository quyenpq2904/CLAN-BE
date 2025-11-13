import { AllConfigType } from '@/config/config.type';
import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudflareService } from './cloudflare.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const accountId = configService.getOrThrow('cloudflare.r2AccountId', {
          infer: true,
        });
        const accessKeyId = configService.getOrThrow(
          'cloudflare.r2AccessKeyId',
          {
            infer: true,
          },
        );
        const secretAccessKey = configService.getOrThrow(
          'cloudflare.r2SecretAccessKey',
          {
            infer: true,
          },
        );

        return new S3Client({
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
          region: 'auto',
        });
      },
      inject: [ConfigService],
    },
    CloudflareService,
  ],
  exports: [CloudflareService],
})
export class CloudflareModule {}
