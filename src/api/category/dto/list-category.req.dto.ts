import { StringFieldOptional } from '@/decorators/field.decorators';

export class ListCategoryReqDto {
  @StringFieldOptional()
  q?: string;
}
