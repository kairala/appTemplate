import { Inject, Injectable, Logger } from '@nestjs/common';
import { SendTemplateEmailUseCase } from './sendTemplateEmail.useCase';
import { ConfigService } from '@nestjs/config';
import { UseCase } from '../../../types/useCase.interface';

type Params = {
  userName: string;
  to: string;
  validationCode: string;
};

@Injectable()
export class SendWelcomeEmailUseCase implements UseCase<Params, void> {
  private readonly logger = new Logger(SendWelcomeEmailUseCase.name);

  constructor(
    @Inject()
    private readonly sendTemplateEmailuseCase: SendTemplateEmailUseCase,
    private readonly configService: ConfigService,
  ) {}

  public async execute({
    userName,
    to,
    validationCode,
  }: Params): Promise<void> {
    const url = this.configService.getOrThrow<string>('APP_URL');

    return this.sendTemplateEmailuseCase.execute({
      variables: {
        userName,
        validationLink: `${url}/auth/signup/confirm?token=${validationCode}`,
      },
      templateName: 'welcome',
      subject: 'Bem vindo',
      to,
    });
  }
}
