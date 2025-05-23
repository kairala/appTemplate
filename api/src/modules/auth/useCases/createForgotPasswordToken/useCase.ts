import { InjectModel } from '@nestjs/sequelize';
import { UseCase } from '../../../../types/useCase.interface';
import { User } from '../../../../db/models/user/user.model';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { randomBytes } from 'node:crypto';
import { CreateForgotPasswordTokenRequestDto } from './request.dto';
import { ForgotPasswordToken } from '../../../../db/models/user/forgotPasswordToken.model';
import { ProviderEnum } from '../../../../db/models/user/provider.enum';
import { SendForgotPasswordTokenUseCase } from '../../../mail/useCases/sendForgotPasswordToken.useCase';

@Injectable()
export class CreateForgotPasswordTokenUseCase
  implements UseCase<CreateForgotPasswordTokenRequestDto, void>
{
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(User) private readonly userMode: typeof User,
    @InjectModel(ForgotPasswordToken)
    private readonly forgotPasswordTokenModel: typeof ForgotPasswordToken,
    private readonly i18nService: I18nService,
    private readonly sendForgotPasswordTokenUseCase: SendForgotPasswordTokenUseCase,
  ) {}

  async execute(
    request: CreateForgotPasswordTokenRequestDto,
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
    request: CreateForgotPasswordTokenRequestDto,
    transaction: Transaction,
  ): Promise<void> {
    const user = await this.userMode.findOne({
      where: {
        email: request.email,
        provider: ProviderEnum.LOCAL,
        verifiedAt: {
          [Op.ne]: null,
        },
      },
      transaction,
      useMaster: true,
    });

    if (!user) {
      throw new PreconditionFailedException(
        this.i18nService.t('auth.userNotFound'),
      );
    }

    const token = randomBytes(100).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day

    await this.forgotPasswordTokenModel.update(
      {
        usedAt: new Date(),
      },
      {
        where: {
          userId: user.id,
        },
      },
    );

    const forgotPasswordToken = await this.forgotPasswordTokenModel.create(
      {
        token,
        expiresAt,
        userId: user.id,
      },
      { transaction },
    );

    transaction.afterCommit(async () => {
      await this.sendForgotPasswordTokenUseCase.execute({
        userName: user.name,
        to: user.email,
        validationCode: forgotPasswordToken.token,
      });
    });
  }
}
