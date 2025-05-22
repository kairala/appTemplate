import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import LocalStrategy from './strategies/local.strategy';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../db/models/user/user.model';
import JwtStrategy from './strategies/jwt.strategy';
import { SignUpController } from './controllers/signUp/controller';
import { CreateLocalUserUseCase } from './useCases/createLocalUser/useCase';
import { BuildTokensUseCase } from './useCases/buildTokens/useCase';
import { SignInUseCase } from './useCases/signIn/useCase';
import { SignInController } from './controllers/singIn/controller';
import { ConfirmationToken } from '../../db/models/user/confirmationToken.model';
import { CreateConfirmationTokenUseCase } from './useCases/createConfirmationToken/useCase';
import { MailModule } from '../mail/mail.module';
import { ResendConfirmationTokenController } from './controllers/resendConfirmationToken/controller';
import { VerifyEmailUseCase } from './useCases/verifyEmail/useCase';
import { VerifyEmailController } from './controllers/verifyEmail/controller';
import { CreateForgotPasswordTokenUseCase } from './useCases/createForgotPasswordToken/useCase';
import { ForgotPasswordToken } from '../../db/models/user/forgotPasswordToken.model';
import { RequestForgotPasswordController } from './controllers/requestForgotPassword/controller';
import { ResetPasswordByTokenController } from './controllers/resetPasswordByToken/controller';
import { UpdatePasswordByTokenUseCase } from './useCases/updatePasswordByToken/useCase';
import GoogleStrategy from './strategies/google.strategy';
import { GoogleRedirectController } from './controllers/googleRedirect/controller';
import { GoogleSuccessController } from './controllers/googleSuccess/controller';
import { RefreshToken } from '../../db/models/user/refreshToken.model';
import { RefreshUseCase } from './useCases/refresh/useCase';
import { RefreshController } from './controllers/refresh/controller';
import { StripeCustomer } from '../../db/models/user/stripeCustomer.model';
import { MeUseCase } from './useCases/me/useCase';
import { MeController } from './controllers/me/controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow('JWT_SECRET'),
          signOptions: { expiresIn: '60s' },
        };
      },
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([
      User,
      ConfirmationToken,
      ForgotPasswordToken,
      RefreshToken,
      StripeCustomer,
    ]),
    MailModule,
  ],
  controllers: [
    SignUpController,
    SignInController,
    ResendConfirmationTokenController,
    VerifyEmailController,
    RequestForgotPasswordController,
    ResetPasswordByTokenController,
    GoogleRedirectController,
    GoogleSuccessController,
    RefreshController,
    MeController,
  ],
  providers: [
    CreateLocalUserUseCase,
    BuildTokensUseCase,
    SignInUseCase,
    CreateConfirmationTokenUseCase,
    VerifyEmailUseCase,
    CreateForgotPasswordTokenUseCase,
    UpdatePasswordByTokenUseCase,
    RefreshUseCase,
    MeUseCase,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
  ],
  exports: [],
})
export class AuthModule {}
