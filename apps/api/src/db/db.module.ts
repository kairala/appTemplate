import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user/user.model';
import { ConfigService } from '@nestjs/config';
import { ConfirmationToken } from './models/user/confirmationToken.model';
import { ForgotPasswordToken } from './models/user/forgotPasswordToken.model';
import { RefreshToken } from './models/user/refreshToken.model';
import { StorageFile } from './models/storage/storageFile.model';
import { StripeCustomer } from './models/user/stripeCustomer.model';

@Module({
  controllers: [],
  providers: [],
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('Sequelize');
        logger.log('Initializing Sequelize...');

        return {
          dialect: 'postgres',
          host: configService.getOrThrow<string>('DATABASE_HOST'),
          port: configService.getOrThrow<number>('DATABASE_PORT'),
          username: configService.getOrThrow<string>('DATABASE_USER'),
          password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
          database: configService.getOrThrow<string>('DATABASE_NAME'),
          // logging: logger.debug.bind(logger),
          dialectOptions:
            process.env.NODE_ENV === 'development' ||
            process.env.NODE_ENV === 'test'
              ? undefined
              : {
                  ssl: {
                    require: true,
                    rejectUnauthorized: false,
                  },
                },
          models: [
            User,
            ConfirmationToken,
            ForgotPasswordToken,
            RefreshToken,
            StripeCustomer,
            StorageFile,
          ],
          sync: {
            alter: false,
            force: false,
          },
        };
      },
    }),
  ],
})
export class DbModule {}
