import { CloudflareModule } from '@/libs/cloudflare/cloudflare.module';
import { Global, Module } from '@nestjs/common';
import { FilesService } from './filles.service';

// This module is handle file operations, currently utilizing Cloudflare services, to be expanded in the future.
@Global()
@Module({
  imports: [CloudflareModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
