import {
  BooleanFieldOptional,
  EnumFieldOptional,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { AttributeType } from '../entities/attribute.entity';

export class UpdateAttributeReqDto {
  @StringFieldOptional()
  name?: string;

  @EnumFieldOptional(() => AttributeType)
  type?: AttributeType;

  @BooleanFieldOptional()
  isEnabled?: boolean;
}
