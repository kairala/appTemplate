import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { STRIPE_CLIENT } from '../../providers';
import Stripe from 'stripe';
import { CreateSubscriptionIntentDto } from './request.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../../db/models/user/user.model';
import { StripeCustomer } from '../../../../db/models/user/stripeCustomer.model';
import { Sequelize } from 'sequelize-typescript';
import { PlanEnum } from '../../../../db/models/user/plans.enum';
import { UseCase } from '../../../../types/useCase.interface';

type Params = {
  userId: string;
  payload: CreateSubscriptionIntentDto;
};

@Injectable()
export class CreateSubscriptionIntentUseCase
  implements UseCase<Params, Stripe.Subscription>
{
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(StripeCustomer)
    private readonly stripeCustomerModel: typeof StripeCustomer,
    private readonly sequelize: Sequelize,
  ) {}

  async execute(params: Params): Promise<Stripe.Subscription> {
    const { userId, payload } = params;

    return this.sequelize.transaction(async (transaction) => {
      const user = await this.userModel.findByPk(userId, {
        include: [
          {
            model: StripeCustomer,
          },
        ],
        transaction,
        useMaster: true,
      });

      if (!user) {
        throw new NotFoundException();
      }

      let stripeCustomer = user.stripeCustomer;

      if (!stripeCustomer) {
        stripeCustomer = await this.stripeCustomerModel.create(
          {
            userId: user.id,
            currentPlan: PlanEnum.FREE,
          },
          { transaction },
        );
      }

      let customerId = stripeCustomer.customerId;

      if (!customerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          name: user.name,
        });

        await stripeCustomer.update(
          {
            customerId: customer.id,
          },
          { transaction },
        );
        customerId = customer.id;
      }

      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: payload.priceId,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.confirmation_secret'],
      });

      return subscription;
    });
  }
}
