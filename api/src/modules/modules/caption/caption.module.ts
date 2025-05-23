import { Module } from '@nestjs/common';
import { INVISION_PROVIDER, OPEN_AI_PROVIDER } from './config/providers';
import vision from '@google-cloud/vision';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

import { SequelizeModule } from '@nestjs/sequelize';
import { Caption } from '../../../db/models/caption/caption.model';
import * as path from 'path';
import { StorageModule } from '../../storage/storage.module';
import { GenerateCaptionController } from './controllers/generate/controller';
import { GenerateCaptionUseCase } from './useCases/generate/useCase';
import { User } from '../../../db/models/user/user.model';
import { ShowCaptionController } from './controllers/show/controller';
import { ShowCaptionUseCase } from './useCases/show/useCase';
import { ListCaptionUseCase } from './useCases/list/useCase';
import { ListCaptionController } from './controllers/list/controller';

@Module({
  controllers: [
    GenerateCaptionController,
    ShowCaptionController,
    ListCaptionController,
  ],
  providers: [
    {
      provide: INVISION_PROVIDER,
      useFactory: (configService: ConfigService) => {
        return new vision.ImageAnnotatorClient({
          keyFile: path.resolve(
            configService.getOrThrow('GOOGLE_CREDENTIALS_JSON_PATH'),
          ),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: OPEN_AI_PROVIDER,
      useFactory: (config: ConfigService) => {
        return new OpenAI({
          apiKey: config.getOrThrow('OPENAI_API_KEY'),
        });
      },
      inject: [ConfigService],
    },
    GenerateCaptionUseCase,
    ShowCaptionUseCase,
    ListCaptionUseCase,
  ],
  imports: [SequelizeModule.forFeature([Caption, User]), StorageModule],
  exports: [],
})
export class CaptionModule {}
