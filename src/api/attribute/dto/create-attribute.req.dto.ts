import {
  BooleanFieldOptional,
  EnumField,
  StringField,
} from '@/decorators/field.decorators';
import { AttributeType } from '../entities/attribute.entity';

export class CreateAttributeReqDto {
  @StringField()
  name: string;

  @EnumField(() => AttributeType)
  type: AttributeType;

  @BooleanFieldOptional()
  isEnabled?: boolean = true;
}
