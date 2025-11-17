import { StringFieldOptional, UUIDField } from '@/decorators/field.decorators';

export class ListAttributeValueReqDto {
  @UUIDField()
  attributeId: string;

  @StringFieldOptional()
  q?: string;
}
