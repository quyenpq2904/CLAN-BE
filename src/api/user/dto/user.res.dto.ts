import {
  ClassField,
  EmailField,
  StringField,
  StringFieldOptional,
  URLFieldOptional,
  UUIDField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';
import { UserRole, UserStatus } from '../entities/user.entity';
import { IsPhoneNumber } from 'class-validator';

@Exclude()
export class UserResDto {
  @UUIDField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  username: string;

  @EmailField()
  @Expose()
  email: string;

  @StringField()
  @Expose()
  fullName: string;

  @StringFieldOptional()
  @IsPhoneNumber('VN')
  @Expose()
  phoneNumber?: string;

  @URLFieldOptional()
  @Expose()
  avatar?: string;

  @StringFieldOptional()
  @Expose()
  bio?: string;

  @StringField()
  @Expose()
  role: UserRole;

  @StringField()
  @Expose()
  status: UserStatus;

  @ClassField(() => Date)
  @Expose()
  createdAt: Date;

  @ClassField(() => Date)
  @Expose()
  updatedAt: Date;
}
