import {
  BooleanFieldOptional,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { IsPhoneNumber } from 'class-validator';

export class UpdateAddressReqDto {
  @StringFieldOptional()
  receiverName: string;

  @StringFieldOptional()
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @StringFieldOptional()
  address: string;

  @StringFieldOptional()
  provinceId: string;

  @StringFieldOptional()
  wardId: string;

  @BooleanFieldOptional()
  isDefault?: boolean;
}
