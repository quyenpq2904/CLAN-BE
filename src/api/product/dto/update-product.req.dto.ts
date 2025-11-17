import {
  EnumFieldOptional,
  StringFieldOptional,
  UUIDFieldOptional,
} from '@/decorators/field.decorators';
import { ProductStatus } from '../entities/product.entity';

export class UpdateProductReqDto {
  @StringFieldOptional()
  name?: string;

  @StringFieldOptional()
  description?: string;

  @StringFieldOptional()
  thumbnail?: string;

  @UUIDFieldOptional({ each: true, example: ['uuid-cat-new'] })
  categoryIds?: string[];

  @EnumFieldOptional(() => ProductStatus)
  status?: ProductStatus;
}
