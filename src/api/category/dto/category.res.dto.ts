import {
  BooleanField,
  ClassField,
  StringField,
  UUIDField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CategoryResDto {
  @UUIDField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  slug: string;

  @BooleanField()
  @Expose()
  isEnabled: boolean;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;
}
