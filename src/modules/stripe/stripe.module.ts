import { Module } from '@nestjs/common';
import { Stripe } from 'stripe';
import { STRIPE_CLIENT } from './providers';
import { ConfigService } from '@nestjs/config';
import { GetAvailableProductsController } from './controllers/getAvailablePlans/controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { StripeCustomer } from '../../db/models/user/stripeCustomer.model';
import { User } from '../../db/models/user/user.model';
import { CreateSubscriptionIntentController } from './controllers/createSubscriptionIntent/controller';
import { CreateSubscriptionIntentUseCase } from './useCases/createSubscriptionIntent/useCase';
import { WebhookController } from './controllers/webhook/controller';
import { InvoicePaidUseCase } from './useCases/webhook/invoicePaid.useCase';
import { InvoicePaymentFailedUseCase } from './useCases/webhook/invoicePaymentFailed.useCase';
import { SubscriptionDeletedUseCase } from './useCases/webhook/subscriptionDeleted.useCase';

@Module({
  controllers: [
    GetAvailableProductsController,
    CreateSubscriptionIntentController,
    WebhookController,
  ],
  providers: [
    {
      provide: STRIPE_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const stripeSecretKey =
          configService.getOrThrow<string>('STRIPE_SECRET_KEY');

        return new Stripe(stripeSecretKey, {});
      },
    },
    CreateSubscriptionIntentUseCase,
    InvoicePaidUseCase,
    InvoicePaymentFailedUseCase,
    SubscriptionDeletedUseCase,
  ],
  imports: [SequelizeModule.forFeature([StripeCustomer, User])],
  exports: [
    {
      provide: STRIPE_CLIENT,
      useExisting: STRIPE_CLIENT,
    },
  ],
})
export class StripeModule {}
