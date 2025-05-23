import { JwtService } from '@nestjs/jwt';
import { UseCase } from '../../../../types/useCase.interface';
import { TokensDto } from '../../dto/tokens/token.dto';
import { ValidateUserResponseDto } from '../../dto/validate/response.dto';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from '../../../../db/models/user/refreshToken.model';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class BuildTokensUseCase
  implements UseCase<ValidateUserResponseDto, TokensDto>
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(RefreshToken)
    private readonly refreshTokenModel: typeof RefreshToken,
    private readonly sequelize: Sequelize,
  ) {}

  public async execute(
    request: ValidateUserResponseDto,
    transaction?: Transaction,
  ): Promise<TokensDto> {
    if (transaction) {
      return this.executeWithTransaction(request, transaction);
    }

    return this.sequelize.transaction((transaction) =>
      this.executeWithTransaction(request, transaction),
    );
  }

  public async executeWithTransaction(
    request: ValidateUserResponseDto,
    transaction: Transaction,
  ): Promise<TokensDto> {
    const accessExpiresIn = this.configService.getOrThrow<number>(
      'JWT_ACCESS_TOKEN_EXPIRES_IN',
    );
    const accessToken = this.jwtService.sign(request, {
      expiresIn: accessExpiresIn,
    });

    const refreshExpiresIn = this.configService.getOrThrow<number>(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    );
    const refreshToken = this.jwtService.sign(request, {
      expiresIn: refreshExpiresIn,
    });

    await this.refreshTokenModel.destroy({
      where: { userId: request.id },
      transaction,
    });

    await this.refreshTokenModel.create(
      {
        userId: request.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + refreshExpiresIn * 1000),
      },
      { transaction },
    );

    return {
      accessToken,
      accessExpiresIn,
      refreshToken,
      refreshExpiresIn,
    };
  }
}
