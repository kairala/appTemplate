import { ApiProperty } from '@nestjs/swagger';

export class CreateConfirmationTokenRequestDto {
  @ApiProperty({
    description: 'Email of the user to send the confirmation token to',
  })
  email: string;
}
