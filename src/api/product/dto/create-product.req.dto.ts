import {
  ClassField,
  StringField,
  StringFieldOptional,
  UUIDField,
} from '@/decorators/field.decorators';
import { CreateVariantReqDto } from './create-variant.req.dto';
import { type Uuid } from '@/common/types/common.type';

export class CreateProductReqDto {
  @UUIDField()
  shopId: Uuid;

  @StringField()
  name: string;

  @StringFieldOptional()
  description?: string;

  @UUIDField({ each: true, example: ['uuid-cat-1', 'uuid-cat-2'] })
  categoryIds: string[];

  @StringFieldOptional()
  thumbnail?: string;

  @ClassField(() => CreateVariantReqDto, { each: true })
  variants: CreateVariantReqDto[];
}
