import { StringField } from '@/decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateShopReqDto {
  @StringField()
  name: string;

  @StringField()
  description: string;

  @StringField()
  address: string;

  @StringField()
  phoneNumber: string;

  @StringField()
  email: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  banner?: string;
}
