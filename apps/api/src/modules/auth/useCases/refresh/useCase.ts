import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UseCase } from '../../../../types/useCase.interface';
import { RefreshRequestDto } from './request.dto';
import { TokensDto } from '../../dto/tokens/token.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../../db/models/user/user.model';
import { RefreshToken } from '../../../../db/models/user/refreshToken.model';
import { JwtService } from '@nestjs/jwt';
import { ValidateUserResponseDto } from '../../dto/validate/response.dto';
import { Sequelize } from 'sequelize-typescript';
import { BuildTokensUseCase } from '../buildTokens/useCase';

@Injectable()
export class RefreshUseCase implements UseCase<RefreshRequestDto, TokensDto> {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly sequelize: Sequelize,
    private readonly buildTokensUseCase: BuildTokensUseCase,
  ) {}

  async execute(request: RefreshRequestDto): Promise<TokensDto> {
    return this.sequelize.transaction(async (transaction) => {
      const verifiedToken = this.jwtService.verify<ValidateUserResponseDto>(
        request.refreshToken,
      );

      const user = await this.userModel.findOne({
        where: { id: verifiedToken.id },
        include: [
          {
            model: RefreshToken,
            where: { token: request.refreshToken },
            required: true,
          },
        ],
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      return this.buildTokensUseCase.execute(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          provider: user.provider,
        },
        transaction,
      );
    });
  }
}
