import { ApiProperty } from '@nestjs/swagger';

export class NoResponseDto {
  @ApiProperty()
  ok: true;
}
