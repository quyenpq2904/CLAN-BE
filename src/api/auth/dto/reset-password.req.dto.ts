import { PasswordField, StringField } from '@/decorators/field.decorators';

export class ResetPasswordReqDto {
  @StringField()
  token!: string;

  @PasswordField()
  newPassword!: string;
}
