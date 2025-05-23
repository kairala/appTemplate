import { Module } from '@nestjs/common';

import { SESClient } from '@aws-sdk/client-ses';
import { SES_CLIENT } from './providers';
import { SendEmailUseCase } from './useCases/sendEmail.useCase';
import { SendTemplateEmailUseCase } from './useCases/sendTemplateEmail.useCase';
import { SendWelcomeEmailUseCase } from './useCases/sendWelcomeEmail.useCase';
import { ConfigService } from '@nestjs/config';
import { SendForgotPasswordTokenUseCase } from './useCases/sendForgotPasswordToken.useCase';

@Module({
  controllers: [],
  providers: [
    {
      provide: SES_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const region = configService.getOrThrow<string>('AWS_REGION');
        return new SESClient({ region });
      },
    },
    SendEmailUseCase,
    SendTemplateEmailUseCase,
    SendWelcomeEmailUseCase,
    SendForgotPasswordTokenUseCase,
  ],
  imports: [],
  exports: [
    SendTemplateEmailUseCase,
    SendWelcomeEmailUseCase,
    SendForgotPasswordTokenUseCase,
  ],
})
export class MailModule {}
