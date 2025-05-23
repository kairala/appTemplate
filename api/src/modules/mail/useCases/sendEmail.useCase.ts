import { Inject, Injectable, Logger } from '@nestjs/common';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { SES_CLIENT } from '../providers';
import { ConfigService } from '@nestjs/config';
import { UseCase } from '../../../types/useCase.interface';

type Params = {
  message: string;
  subject: string;
  to: string;
};

@Injectable()
export class SendEmailUseCase implements UseCase<Params, void> {
  private readonly logger = new Logger(SendEmailUseCase.name);

  constructor(
    @Inject(SES_CLIENT) private readonly sesClient: SESClient,
    private readonly configService: ConfigService,
  ) {}

  public async execute({ message, subject, to }: Params): Promise<void> {
    const from = this.configService.getOrThrow<string>('FROM_EMAIL');
    const useLocalLogger = this.configService.get<boolean>(
      'EMAIL_USE_LOCAL_LOGGER',
    );

    if (useLocalLogger) {
      this.logger.log(`Sending email to ${to}`);
      this.logger.log(`Email subject: ${subject}`);
      this.logger.log(`Message: ${message}`);
      return;
    }

    const sendEmailCommand = new SendEmailCommand({
      Destination: {
        CcAddresses: [],
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: message,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: from,
      ReplyToAddresses: [],
    });

    try {
      await this.sesClient.send(sendEmailCommand);
      return;
    } catch (caught) {
      this.logger.error(caught);
      throw caught;
    }
  }
}
