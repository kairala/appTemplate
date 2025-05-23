import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import GoogleAuthGuard from '../../guards/googleAuth.guard';

@ApiTags('Auth')
@Controller('auth/google')
export class GoogleRedirectController {
  constructor() {}

  @ApiBody({})
  @ApiOkResponse({ description: 'Success, redirect' })
  @ApiInternalServerErrorResponse({ description: '500. InternalServerError' })
  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}
}
