import {
  BooleanFieldOptional,
  StringField,
} from '@/decorators/field.decorators';

export class CreateCategoryReqDto {
  @StringField()
  name: string;

  @BooleanFieldOptional()
  isEnabled?: boolean = true;
}
