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
export class SendForgotPasswordTokenUseCase implements UseCase<Params, any> {
  private readonly logger = new Logger(SendForgotPasswordTokenUseCase.name);

  constructor(
    @Inject()
    private readonly sendTemplateEmailuseCase: SendTemplateEmailUseCase,
    private readonly configService: ConfigService,
  ) {}

  public async execute({ userName, to, validationCode }: Params): Promise<any> {
    const url = this.configService.getOrThrow<string>('APP_URL');

    return this.sendTemplateEmailuseCase.execute({
      variables: {
        userName,
        validationLink: `${url}/auth/forgotPassword?token=${validationCode}`,
      },
      templateName: 'forgotPassword',
      subject: 'Recuperação de senha',
      to,
    });
  }
}
