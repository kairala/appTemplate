import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SignInRequestDto {
  @ApiProperty()
  @IsEmail({}, { message: i18nValidationMessage('validations.EMAIL') })
  email: string;

  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validations.IS_STRING') })
  password: string;
}
