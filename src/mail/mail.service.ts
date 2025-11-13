import { AllConfigType } from '@/config/config.type';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmailVerification(email: string, token: string) {
    const url = `${this.configService.get('app.url', { infer: true })}/api/v1/auth/verify/email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Please verify your email',
      template: 'email-verification',
      context: {
        email: email,
        url,
      },
    });
  }

  async sendForgotPassword(email: string, token: string) {
    const url = `${this.configService.get('app.url', { infer: true })}/api/v1/auth/forgot-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: 'forgot-password',
      context: {
        email: email,
        url,
      },
    });
  }
}
