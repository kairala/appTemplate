import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ShowCaptionUseCase } from '../../useCases/show/useCase';
import { ValidateUserResponseDto } from '../../../../auth/dto/validate/response.dto';
import JwtAuthGuard from '../../../../auth/guards/jwtAuth.guard';

@Controller('caption')
export class ShowCaptionController {
  constructor(private readonly showCaptionUseCase: ShowCaptionUseCase) {}

  @Get(':captionId')
  @UseGuards(JwtAuthGuard)
  async showCaption(
    @Param('captionId') captionId: string,
    @Req() { user }: { user: ValidateUserResponseDto },
  ) {
    return this.showCaptionUseCase.execute({
      userId: user.id,
      captionId,
    });
  }
}
