import { Module } from '@nestjs/common';
import { INVISION_PROVIDER, OPEN_AI_PROVIDER } from './config/providers';
import { googleConfig } from './config/google';
import vision from '@google-cloud/vision';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { GenerateCaptionService } from './services/generateCaption.service';
import { CaptionController } from './controller/caption.controller';
import { AuthModule } from '../../auth/auth.module';
import { CaptionService } from './services/captions.service';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [CaptionController],
  providers: [
    {
      provide: INVISION_PROVIDER,
      useFactory: () => {
        return new vision.ImageAnnotatorClient({
          credentials: googleConfig,
        });
      },
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
    GenerateCaptionService,
    CaptionService,
  ],
  imports: [SequelizeModule.forFeature([]), AuthModule],
  exports: [],
})
export class IAModule {}
