import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshUseCase } from '../../useCases/refresh/useCase';
import { TokensDto } from '../../dto/tokens/token.dto';
import { RefreshRequestDto } from '../../useCases/refresh/request.dto';

@ApiTags('Auth')
@Controller('auth/refresh')
export class RefreshController {
  constructor(private readonly refreshUseCase: RefreshUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refresh token',
  })
  @ApiUnauthorizedResponse({
    description: 'The refresh token is invalid or expired',
  })
  @ApiCreatedResponse({
    description: 'Refresh token response',
    type: TokensDto,
  })
  async refresh(@Body() body: RefreshRequestDto): Promise<TokensDto> {
    return this.refreshUseCase.execute(body);
  }
}
