import { Controller, Get, Param, Res } from '@nestjs/common';
import { ShowFileUseCase } from '../../useCase/show/useCase';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('file/:fileId')
@ApiTags('Storage')
export class DownloadFileController {
  constructor(
    private showFileUseCase: ShowFileUseCase,
    private configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: 'Download file',
    description: 'Download file',
  })
  @ApiOkResponse({
    description: 'File downloaded successfully, redirecting to CloudFront URL',
  })
  @Get()
  async create(@Param('fileId') fileId: string, @Res() res: Response) {
    const file = await this.showFileUseCase.execute({
      id: fileId,
    });

    const cloudFrontUrl =
      this.configService.getOrThrow<string>('CLOUDFRONT_URL');

    res.redirect(`${cloudFrontUrl}/${file.providerRef}`);
  }
}
