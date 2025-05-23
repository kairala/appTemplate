import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({
    description: 'The access token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The access token expiration time in seconds',
  })
  accessExpiresIn: number;

  @ApiProperty({
    description: 'The refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'The refresh token expiration time in seconds',
  })
  refreshExpiresIn: number;
}
