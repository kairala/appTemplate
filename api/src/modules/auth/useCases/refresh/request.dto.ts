import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RefreshRequestDto {
  @ApiProperty({
    description: 'Refresh token',
  })
  @IsString({
    message: i18nValidationMessage('validations.IS_STRING'),
  })
  refreshToken: string;
}
