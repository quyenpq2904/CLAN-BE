import { EmailField, StringField } from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class VerifyEmailResDto {
  @Expose()
  @EmailField()
  email!: string;

  @Expose()
  @StringField()
  userId!: string;
}
