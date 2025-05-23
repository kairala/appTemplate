import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VerifyEmailRequestDto {
  @IsString({
    message: i18nValidationMessage('validations.IS_STRING'),
  })
  @ApiProperty({
    description: 'The token to verify the email',
    example: '1234567890abcdef1234567890abcdef',
  })
  token: string;
}
