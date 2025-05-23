import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileUseCase } from '../../useCase/create/useCase';
import { v4 as uuidv4 } from 'uuid';
import JwtAuthGuard from '../../../auth/guards/jwtAuth.guard';
import { ValidateUserResponseDto } from '../../../auth/dto/validate/response.dto';

@ApiTags('Storage')
@Controller('file')
export class UploadFileController {
  constructor(private readonly uploadFileUseCase: UploadFileUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() { user }: { user: ValidateUserResponseDto },
  ) {
    return this.uploadFileUseCase.execute({
      userId: user.id,
      body: file.buffer,
      contentType: file.mimetype,
      key: uuidv4(),
    });
  }
}
