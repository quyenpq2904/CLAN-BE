import { AllConfigType } from '@/config/config.type';
import { FilePrefix } from '@/constants/file-prefix.constant';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';

@Injectable()
export class CloudflareService implements OnModuleInit {
  private BUCKER_NAME: string;
  private BUCKER_PUBLIC_URL: string;
  constructor(
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  onModuleInit() {
    this.BUCKER_NAME = this.configService.getOrThrow(
      'cloudflare.r2BucketName',
      {
        infer: true,
      },
    );
    this.BUCKER_PUBLIC_URL = this.configService.getOrThrow(
      'cloudflare.r2PublicBucketUrl',
      {
        infer: true,
      },
    );
  }

  // Public bucket => return full url
  async uploadFile(
    file: Express.Multer.File,
    prefix: FilePrefix,
  ): Promise<string> {
    const fileExt = path.extname(file.originalname);
    const fileName =
      `${prefix}/` +
      file.originalname
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now() +
      fileExt;

    const contentType = file.mimetype || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: this.BUCKER_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    return `${this.BUCKER_PUBLIC_URL}/${fileName}`;
  }

  // Private bucket => store key only
  async uploadFileV0(file: Express.Multer.File): Promise<string> {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, '')
        .toLowerCase()
        .split(' ')
        .join('-') +
      '-' +
      Date.now() +
      fileExt;

    const contentType = file.mimetype || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: this.BUCKER_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    return fileName;
  }

  async getDownloadedUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.BUCKER_NAME,
      Key: fileKey,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }
}
