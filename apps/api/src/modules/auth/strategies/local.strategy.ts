import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../db/models/user/user.model';
import { ValidateUserResponseDto } from '../dto/validate/response.dto';
import { ProviderEnum } from '../../../db/models/user/provider.enum';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<ValidateUserResponseDto> {
    const user = await this.userModel.findOne({
      attributes: ['id', 'email', 'provider', 'password', 'name'],
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.provider !== ProviderEnum.LOCAL) {
      throw new UnauthorizedException();
    }

    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      provider: user.provider,
      name: user.name,
    };
  }
}
