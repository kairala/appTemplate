import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import {
  BadRequestException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../db/models/user/user.model';
import { ProviderEnum } from '../../../db/models/user/provider.enum';
import { Sequelize } from 'sequelize-typescript';
import { I18nService } from 'nestjs-i18n';
import { ValidateUserResponseDto } from '../dto/validate/response.dto';
import { Request } from 'express';

@Injectable()
export default class GoogleStrategy extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly sequelize: Sequelize,
    private readonly i18nService: I18nService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.getOrThrow<string>('API_HOST')}/auth/google/redirect`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  authenticate(req: Request) {
    return super.authenticate(req, {
      state: req.query.state || null,
    });
  }

  async validate(
    request: any,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    _done: VerifyCallback,
  ): Promise<ValidateUserResponseDto> {
    const { state } = request.query;

    const { emails } = profile;

    if (!emails || emails.length === 0) {
      throw new BadRequestException(
        this.i18nService.t('auth.invalidGoogleProfile'),
      );
    }

    return this.sequelize.transaction(async (transaction) => {
      let user = await this.userModel.findOne({
        where: {
          email: emails[0].value,
        },
        useMaster: true,
        transaction,
      });

      if (user && user.provider !== ProviderEnum.GOOGLE) {
        throw new PreconditionFailedException(
          this.i18nService.t('auth.userAlreadyExists'),
        );
      }

      if (!user) {
        user = await this.userModel.create(
          {
            email: emails[0].value,
            provider: ProviderEnum.GOOGLE,
            name: profile.displayName,
            verifiedAt: new Date(),
            providerId: profile.id,
          },
          {
            transaction,
          },
        );
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        state,
      };
    });
  }
}
