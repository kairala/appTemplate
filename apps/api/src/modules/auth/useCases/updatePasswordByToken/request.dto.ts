import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordByTokenRequestDto {
  @ApiProperty({
    description: 'Token for the user to reset their password',
  })
  token: string;

  @ApiProperty({
    description: 'New password for the user',
  })
  newPassword: string;
}
