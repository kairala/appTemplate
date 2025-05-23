import { InjectModel } from '@nestjs/sequelize';
import { UseCase } from '../../../../types/useCase.interface';
import { User } from '../../../../db/models/user/user.model';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ConfirmationToken } from '../../../../db/models/user/confirmationToken.model';
import { randomBytes } from 'node:crypto';
import { SendWelcomeEmailUseCase } from '../../../mail/useCases/sendWelcomeEmail.useCase';
import { CreateConfirmationTokenRequestDto } from './request.dto';
import { ProviderEnum } from '../../../../db/models/user/provider.enum';

@Injectable()
export class CreateConfirmationTokenUseCase
  implements UseCase<CreateConfirmationTokenRequestDto, void>
{
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(User) private readonly userMode: typeof User,
    @InjectModel(ConfirmationToken)
    private readonly confirmationTokenModel: typeof ConfirmationToken,
    private readonly i18nService: I18nService,
    private readonly sendWelcomeEmailUseCase: SendWelcomeEmailUseCase,
  ) {}

  async execute(
    request: CreateConfirmationTokenRequestDto,
    transaction?: Transaction,
  ): Promise<void> {
    if (transaction) {
      return this.executeWithTransaction(request, transaction);
    }

    return this.sequelize.transaction(async (transaction) => {
      return this.executeWithTransaction(request, transaction);
    });
  }

  private async executeWithTransaction(
    request: CreateConfirmationTokenRequestDto,
    transaction: Transaction,
  ): Promise<void> {
    const user = await this.userMode.findOne({
      where: {
        email: request.email,
        verifiedAt: null,
        provider: ProviderEnum.LOCAL,
      },
      transaction,
    });

    if (!user) {
      throw new PreconditionFailedException(
        this.i18nService.t('auth.userNotFound'),
      );
    }

    const token = randomBytes(100).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day

    await this.confirmationTokenModel.update(
      {
        usedAt: new Date(),
      },
      {
        where: {
          userId: user.id,
        },
      },
    );

    const confirmationToken = await this.confirmationTokenModel.create(
      {
        token,
        expiresAt,
        userId: user.id,
      },
      { transaction },
    );

    transaction.afterCommit(async () => {
      await this.sendWelcomeEmailUseCase.execute({
        userName: user.name,
        to: user.email,
        validationCode: confirmationToken.token,
      });
    });
  }
}
