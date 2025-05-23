import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GenerateCaptionUseCase } from '../../useCases/generate/useCase';
import { GenerateCaptionRequestDto } from '../../useCases/generate/request.dto';
import { ValidateUserResponseDto } from '../../../../auth/dto/validate/response.dto';
import JwtAuthGuard from '../../../../auth/guards/jwtAuth.guard';

@Controller('caption')
@ApiTags('Caption')
export class GenerateCaptionController {
  constructor(
    private readonly generateCaptionUseCase: GenerateCaptionUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async generateCaption(
    @Body() body: GenerateCaptionRequestDto,
    @Req() { user }: { user: ValidateUserResponseDto },
  ) {
    return this.generateCaptionUseCase.execute({
      userId: user.id,
      body,
    });
  }
}
