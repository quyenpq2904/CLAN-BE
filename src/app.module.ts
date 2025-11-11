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
import loggerFactory from '@/utils/logger-factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, redisConfig],
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
  ],
})
export class AppModule {}
