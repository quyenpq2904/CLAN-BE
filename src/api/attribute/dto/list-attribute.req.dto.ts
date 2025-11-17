import {
  EnumFieldOptional,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { AttributeType } from '../entities/attribute.entity';

export class ListAttributeReqDto {
  @StringFieldOptional()
  q?: string;

  @EnumFieldOptional(() => AttributeType)
  type?: AttributeType;
}
