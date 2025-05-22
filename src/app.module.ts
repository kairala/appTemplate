import 'dotenv/config';
import { Module, RequestMethod } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import env from './env/env';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import * as path from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { StorageModule } from './modules/storage/storage.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { StripeModule } from './modules/stripe/stripe.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          pinoHttp: {
            level: configService.get('LOG_LEVEL') || 'info',
            transport:
              configService.get('NODE_ENV') === 'production'
                ? undefined
                : { target: 'pino-pretty' },
            redact: ['req.headers.authorization'],
          },
          exclude: [
            { method: RequestMethod.OPTIONS, path: '*' },
            { method: RequestMethod.ALL, path: '/health' },
          ],
        };
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new HeaderResolver(['x-language', 'X-Language']),

        AcceptLanguageResolver,
      ],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    DbModule,
    HealthModule,
    MailModule,
    AuthModule,
    StripeModule,
    StorageModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
