import {
  BooleanFieldOptional,
  StringField,
} from '@/decorators/field.decorators';
import { IsPhoneNumber } from 'class-validator';

export class CreateAddressReqDto {
  @StringField()
  receiverName: string;

  @StringField()
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @StringField()
  address: string;

  @StringField()
  provinceId: string;

  @StringField()
  wardId: string;

  @BooleanFieldOptional()
  isDefault?: boolean;
}
