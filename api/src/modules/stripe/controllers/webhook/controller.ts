import {
  BadRequestException,
  Controller,
  Inject,
  Logger,
  Post,
  RawBodyRequest,
  Headers,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { STRIPE_CLIENT } from '../../providers';
import Stripe from 'stripe';
import { SkipThrottle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { InvoicePaidUseCase } from '../../useCases/webhook/invoicePaid.useCase';
import { InvoicePaymentFailedUseCase } from '../../useCases/webhook/invoicePaymentFailed.useCase';
import { SubscriptionDeletedUseCase } from '../../useCases/webhook/subscriptionDeleted.useCase';

@Controller('stripe/webhook')
@ApiTags('Stripe')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly configService: ConfigService,
    private readonly invoicePaidUseCase: InvoicePaidUseCase,
    private readonly invoicePaymentFailedUseCase: InvoicePaymentFailedUseCase,
    private readonly subscriptionDeletedUseCase: SubscriptionDeletedUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Get webhook events',
    description: 'Get webhook events',
  })
  @SkipThrottle()
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody!,
        signature,
        this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
      );
    } catch (err) {
      throw new BadRequestException(err);
    }

    this.logger.log('Received event:', event.type);

    switch (event.type) {
      case 'invoice.paid':
        return this.invoicePaidUseCase.execute(event);
      case 'invoice.payment_failed':
        return this.invoicePaymentFailedUseCase.execute(event);
      case 'customer.subscription.deleted':
        return this.subscriptionDeletedUseCase.execute(event);
      default:
        // Unexpected event type
        this.logger.debug(`Unhandled event type`);
    }
  }
}
