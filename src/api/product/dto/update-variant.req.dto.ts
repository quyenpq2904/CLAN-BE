import { OmitType } from '@nestjs/swagger';
import { CreateVariantReqDto } from './create-variant.req.dto';
import { StringFieldOptional } from '@/decorators/field.decorators';

export class UpdateVariantReqDto extends OmitType(CreateVariantReqDto, [
  'attributeValueIds',
  'sku',
] as const) {
  @StringFieldOptional()
  sku?: string;
}
