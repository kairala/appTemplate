import { IsNotEmpty, MinLength, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateLocalUserRequestDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validations.NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validations.IS_STRING'),
  })
  @MinLength(1, {
    message: i18nValidationMessage('validations.MIN_LENGTH'),
  })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validations.EMAIL'),
    },
  )
  readonly email: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validations.NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validations.IS_STRING'),
  })
  @MinLength(1, {
    message: i18nValidationMessage('validations.MIN_LENGTH'),
  })
  readonly name: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty({
    message: i18nValidationMessage('validations.NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validations.IS_STRING'),
  })
  @MinLength(8, {
    message: i18nValidationMessage('validations.MIN_LENGTH'),
  })
  readonly password: string;
}
