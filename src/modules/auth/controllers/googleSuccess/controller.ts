import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import GoogleAuthGuard from '../../guards/googleAuth.guard';
import { ValidateUserResponseDto } from '../../dto/validate/response.dto';
import { BuildTokensUseCase } from '../../useCases/buildTokens/useCase';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth/google/redirect')
export class GoogleSuccessController {
  constructor(
    private buildTokenUseCase: BuildTokensUseCase,
    private readonly configService: ConfigService,
  ) {}

  @ApiOkResponse({ description: 'Success, redirect' })
  @ApiInternalServerErrorResponse({ description: '500. InternalServerError' })
  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @Req() req: { user: ValidateUserResponseDto },
    @Res() res: Response,
  ) {
    const tokens = await this.buildTokenUseCase.execute(req.user);

    const url = new URL(this.configService.getOrThrow<string>('APP_URL'));
    url.pathname = '/auth/google/login';
    url.searchParams.append('accessToken', tokens.accessToken);
    url.searchParams.append('refreshToken', tokens.refreshToken);

    res.redirect(url.toString());
  }
}
