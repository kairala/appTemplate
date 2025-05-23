import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ValidateUserResponseDto } from '../../../../auth/dto/validate/response.dto';
import JwtAuthGuard from '../../../../auth/guards/jwtAuth.guard';
import { ListCaptionUseCase } from '../../useCases/list/useCase';

@Controller('caption')
export class ListCaptionController {
  constructor(private readonly listCaptionUseCase: ListCaptionUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async listCaptions(@Req() { user }: { user: ValidateUserResponseDto }) {
    return this.listCaptionUseCase.execute({
      userId: user.id,
    });
  }
}
