import { MAX_SIZE_IN_BYTES } from '@/constants/app.constant';
import { ErrorCode } from '@/constants/error-code.constant';
import { CloudflareService } from '@/libs/cloudflare/cloudflare.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

@Injectable()
export class FilesService {
  constructor(private readonly cloudflareService: CloudflareService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (file.buffer.length > MAX_SIZE_IN_BYTES) {
      throw new BadRequestException(ErrorCode.E100);
    }
    const fileType = await fileTypeFromBuffer(file.buffer);
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
      throw new BadRequestException(ErrorCode.E101);
    }

    const processedBuffer = await sharp(file.buffer)
      .resize({
        width: 1080,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFormat('webp')
      .webp({ quality: 80 })
      .toBuffer();

    file.buffer = processedBuffer;
    file.mimetype = 'image/webp';
    file.size = processedBuffer.length;

    return await this.cloudflareService.uploadFile(file);
  }

  async getImageUrl(fileKey: string): Promise<string> {
    return await this.cloudflareService.getDownloadedUrl(fileKey);
  }
}
