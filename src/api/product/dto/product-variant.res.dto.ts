import { AttributeValueResDto } from '@/api/attribute-value/dto/attribute-value.res.dto';
import {
  ClassField,
  NumberField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductVariantResDto {
  @UUIDField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  sku: string;

  @NumberField()
  @Expose()
  price: number;

  @NumberFieldOptional()
  @Expose()
  marketPrice?: number;

  @NumberField({ int: true })
  @Expose()
  stockQuantity: number;

  @StringFieldOptional()
  @Expose()
  image?: string;

  @ClassField(() => AttributeValueResDto, { each: true })
  @Expose()
  attributeValues: AttributeValueResDto[];
}
