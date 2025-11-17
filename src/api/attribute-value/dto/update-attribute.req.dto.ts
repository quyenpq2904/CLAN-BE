import {
  NumberFieldOptional,
  StringFieldOptional,
} from '@/decorators/field.decorators';

export class UpdateAttributeValueReqDto {
  @StringFieldOptional()
  value?: string;

  @NumberFieldOptional()
  displayOrder?: number;
}
