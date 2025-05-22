import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MeUseCase } from '../../useCases/me/useCase';
import { ValidateUserResponseDto } from '../../dto/validate/response.dto';
import JwtAuthGuard from '../../guards/jwtAuth.guard';

@ApiTags('Auth')
@Controller('auth/me')
export class MeController {
  constructor(private readonly useCase: MeUseCase) {}

  @Get()
  @ApiOperation({
    summary: 'Get current user info',
    description: 'Get current user info',
  })
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: { user: ValidateUserResponseDto }): Promise<any> {
    return this.useCase.execute(req.user.id);
  }
}
