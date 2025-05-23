import { InjectModel } from '@nestjs/sequelize';
import { UseCase } from '../../../../types/useCase.interface';
import { CreateLocalUserRequestDto } from './request.dto';
import { User } from '../../../../db/models/user/user.model';
import { Transaction } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize-typescript';
import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ProviderEnum } from '../../../../db/models/user/provider.enum';
import { CreateConfirmationTokenUseCase } from '../createConfirmationToken/useCase';

@Injectable()
export class CreateLocalUserUseCase
  implements UseCase<CreateLocalUserRequestDto, void>
{
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly i18nService: I18nService,
    private readonly createConfirmationTokenUseCase: CreateConfirmationTokenUseCase,
  ) {}

  async execute(
    request: CreateLocalUserRequestDto,
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
    request: CreateLocalUserRequestDto,
    transaction: Transaction,
  ): Promise<void> {
    const hashedPassword = await bcrypt.hash(request.password, 10);

    const existingUser = await this.userModel.findOne({
      where: { email: request.email },
      transaction,
      useMaster: true,
    });

    if (existingUser) {
      throw new PreconditionFailedException(
        this.i18nService.t('auth.userAlreadyExists'),
      );
    }

    await this.userModel.create(
      {
        email: request.email,
        name: request.name,
        password: hashedPassword,
        provider: ProviderEnum.LOCAL,
        providerId: request.email,
        verifiedAt: null,
      },
      { transaction },
    );

    await this.createConfirmationTokenUseCase.execute(
      {
        email: request.email,
      },
      transaction,
    );
  }
}
