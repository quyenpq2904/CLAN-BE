import {
  BooleanFieldOptional,
  StringFieldOptional,
} from '@/decorators/field.decorators';

export class UpdateCategoryReqDto {
  @StringFieldOptional()
  name?: string;

  @BooleanFieldOptional()
  isEnabled?: boolean;
}
