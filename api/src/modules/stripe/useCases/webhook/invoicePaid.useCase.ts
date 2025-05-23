import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UseCase } from '../../../../types/useCase.interface';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from '../../providers';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../../db/models/user/user.model';
import { StripeCustomer } from '../../../../db/models/user/stripeCustomer.model';
import { PlanEnum } from '../../../../db/models/user/plans.enum';

@Injectable()
export class InvoicePaidUseCase
  implements UseCase<Stripe.InvoicePaidEvent, void>
{
  private readonly logger = new Logger(InvoicePaidUseCase.name);

  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(StripeCustomer)
    private readonly stripeCustomerModel: typeof StripeCustomer,
  ) {}

  async execute(payload: Stripe.InvoicePaidEvent): Promise<void> {
    this.logger.log('Invoice paid');
    this.logger.log(payload.object);

    if (payload.data.object.status !== 'paid') {
      this.logger.log('Invoice not paid');
    }

    const email = payload.data.object.customer_email;

    this.logger.log('Email: ', email);
    const user = await this.userModel.findOne({
      include: [
        {
          model: StripeCustomer,
          where: {
            stripeCustomerId: payload.data.object.customer as string,
          },
          required: true,
        },
      ],
    });

    if (!user) {
      throw new BadRequestException(
        `User not found for customer: ${payload.data.object.customer as string}`,
      );
    }

    const subscriptionId = payload.data.object.parent?.subscription_details
      ?.subscription as string;

    if (!subscriptionId) {
      throw new BadRequestException(`Subscription id missing`);
    }

    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      throw new BadRequestException(`Subscription not found`);
    }

    const product = await this.stripe.products.retrieve(
      subscription.items.data[0].price.product as string,
    );

    const plan = product.metadata.slug;

    await this.stripeCustomerModel.update(
      {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: payload.data.object.customer as string,
        currentPlan: plan as PlanEnum,
      },
      {
        where: {
          stripeCustomerId: payload.data.object.customer as string,
        },
      },
    );
  }
}
