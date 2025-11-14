import {
  ClassField,
  StringField,
  URLFieldOptional,
  UUIDField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';
import { ShopStatus } from '../entities/shop.entity';

@Exclude()
export class ShopResDto {
  @UUIDField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  description: string;

  @URLFieldOptional()
  @Expose()
  avatar?: string;

  @URLFieldOptional()
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
