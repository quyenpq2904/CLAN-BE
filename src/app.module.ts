import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@/database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '@/database/config/database.config';
import { ApiModule } from '@/api/api.module';
import appConfig from '@/config/app.config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { AllConfigType } from '@/config/config.type';
import path from 'path';
import authConfig from '@/api/auth/config/auth.config';
import redisConfig from '@/redis/config/redis.config';
import { CacheModule } from '@/cache/cache.module';
import { LoggerModule } from 'nestjs-pino';
import { BullModule } from '@nestjs/bullmq';
import loggerFactory from '@/utils/logger-factory';
import { BackgroundModule } from '@/background/background.module';
import { MailModule } from '@/mail/mail.module';
import mailConfig from '@/mail/config/mail.config';
import { LibsModule } from '@/libs/libs.module';
import cloudflareConfig from '@/libs/cloudflare/config/cloudflare.config';
import { FilesModule } from '@/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        authConfig,
        databaseConfig,
        redisConfig,
        mailConfig,
        cloudflareConfig,
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return new DataSource(options).initialize();
      },
    }),
    ApiModule,
    I18nModule.forRootAsync({
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        return {
          fallbackLanguage:
            configService.get('app.fallbackLanguage', {
              infer: true,
            }) || 'en',
          loaderOptions: {
            path: path.join(__dirname, './i18n/'),
            watch: true,
          },
          typesOutputPath: path.join(
            __dirname,
            '../src/generated/i18n.generated.ts',
          ),
        };
      },
      inject: [ConfigService],
    }),
    CacheModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: loggerFactory,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        return {
          connection: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
            password: configService.get('redis.password', { infer: true }),
          },
        };
      },
      inject: [ConfigService],
    }),
    BackgroundModule,
    MailModule,
    LibsModule,
    FilesModule,
  ],
})
export class AppModule {}
