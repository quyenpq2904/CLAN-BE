import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config/config.type';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        transport: {
          host: configService.get('mail.host', { infer: true }),
          port: configService.get('mail.port', { infer: true }),
          logger: false,
          auth: {
            user: configService.get('mail.user', { infer: true }),
            pass: configService.get('mail.password', { infer: true }),
          },
        },
        defaults: {
          from: `"${configService.get('mail.defaultName', { infer: true })}" <${configService.get('mail.defaultEmail', { infer: true })}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
