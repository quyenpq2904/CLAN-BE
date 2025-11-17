import {
  NumberFieldOptional,
  StringField,
  UUIDField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AttributeValueResDto {
  @UUIDField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  value: string;

  @NumberFieldOptional()
  @Expose()
  displayOrder?: number;

  @UUIDField()
  @Expose()
  attributeId: string;
}
