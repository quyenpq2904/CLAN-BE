import { BooleanField, StringField } from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AddressResDto {
  @StringField()
  @Expose()
  id: string;
  @StringField()
  @Expose()
  receiverName: string;

  @StringField()
  @Expose()
  phoneNumber: string;

  @StringField()
  @Expose()
  address: string;

  @StringField()
  @Expose()
  provinceId: string;

  @StringField()
  @Expose()
  wardId: string;

  @StringField()
  @Expose()
  districtId: string;

  @BooleanField()
  @Expose()
  isDefault: boolean;
}
