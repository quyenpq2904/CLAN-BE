import { StringField } from '@/decorators/field.decorators';

export class RefreshResDto {
  @StringField()
  accessToken!: string;

  @StringField()
  refreshToken!: string;
}
