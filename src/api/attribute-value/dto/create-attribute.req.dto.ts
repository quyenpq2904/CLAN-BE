import { type Uuid } from '@/common/types/common.type';
import {
  NumberFieldOptional,
  StringField,
  UUIDField,
} from '@/decorators/field.decorators';

export class CreateAttributeValueReqDto {
  @StringField()
  value: string;

  @UUIDField()
  attributeId: Uuid;

  @NumberFieldOptional()
  displayOrder?: number;
}
