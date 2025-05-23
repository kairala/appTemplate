import { InjectModel } from '@nestjs/sequelize';
import { UseCase } from '../../../../types/useCase.interface';
import { SignInRequestDto } from './request.dto';
import { User } from '../../../../db/models/user/user.model';
import { Transaction } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { Sequelize } from 'sequelize-typescript';
import {
  Injectable,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProviderEnum } from '../../../../db/models/user/provider.enum';
import { TokensDto } from '../../dto/tokens/token.dto';
import { BuildTokensUseCase } from '../buildTokens/useCase';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SignInUseCase implements UseCase<SignInRequestDto, TokensDto> {
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(User) private readonly userMode: typeof User,
    private readonly buildTokensUseCase: BuildTokensUseCase,
    private readonly i18nService: I18nService,
  ) {}

  async execute(
    request: SignInRequestDto,
    transaction?: Transaction,
  ): Promise<TokensDto> {
    if (transaction) {
      return this.executeWithTransaction(request, transaction);
    }

    return this.sequelize.transaction(async (transaction) => {
      return this.executeWithTransaction(request, transaction);
    });
  }

  private async executeWithTransaction(
    request: SignInRequestDto,
    transaction: Transaction,
  ): Promise<TokensDto> {
    const user = await this.userMode.findOne({
      attributes: ['id', 'email', 'password', 'name', 'verifiedAt', 'provider'],
      where: { email: request.email },
      transaction,
      useMaster: true,
    });

    if (!user || user.provider !== ProviderEnum.LOCAL || !user.password) {
      throw new UnauthorizedException();
    }

    if (!user.verifiedAt) {
      throw new PreconditionFailedException(
        this.i18nService.t('auth.userNotVerified'),
      );
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return this.buildTokensUseCase.execute({
      id: user.id,
      email: user.email,
      provider: user.provider,
      name: user.name,
    });
  }
}
