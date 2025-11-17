import {
  NumberField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '@/decorators/field.decorators';

export class CreateVariantReqDto {
  @StringField({ example: 'AO-THUN-DEN-M' })
  sku: string;

  @NumberField({ min: 0, example: 150000 })
  price: number;

  @NumberFieldOptional({ min: 0, example: 200000 })
  marketPrice?: number;

  @NumberField({ int: true, min: 0, example: 100 })
  stockQuantity: number;

  @StringFieldOptional({ example: 'url-anh-bien-the.jpg' })
  image?: string;

  @UUIDField({ each: true, example: ['uuid-mau-den', 'uuid-size-m'] })
  attributeValueIds: string[];
}
