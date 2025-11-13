import { Module } from '@nestjs/common';
import { CloudflareModule } from './cloudflare/cloudflare.module';

@Module({
  imports: [CloudflareModule],
})
export class LibsModule {}
