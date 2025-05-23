import { ApiProperty } from '@nestjs/swagger';

export class CreateForgotPasswordTokenRequestDto {
  @ApiProperty({
    description: 'Email of the user to send the forgot password token to',
  })
  email: string;
}
