import {
  ClassField,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';
import { ShopStatus } from '../entities/shop.entity';

@Exclude()
export class ShopResDto {
  @StringField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  description: string;

  @StringFieldOptional()
  @Expose()
  avatar?: string;

  @StringFieldOptional()
  @Expose()
  banner?: string;

  @StringField()
  @Expose()
  status: ShopStatus;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;
}
