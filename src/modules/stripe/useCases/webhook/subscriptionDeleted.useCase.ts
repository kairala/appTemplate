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

@Injectable()
export class SubscriptionDeletedUseCase
  implements UseCase<Stripe.CustomerSubscriptionDeletedEvent, void>
{
  private readonly logger = new Logger(SubscriptionDeletedUseCase.name);

  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(StripeCustomer)
    private readonly stripeCustomerModel: typeof StripeCustomer,
  ) {}

  async execute(
    payload: Stripe.CustomerSubscriptionDeletedEvent,
  ): Promise<void> {
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

    await this.stripeCustomerModel.update(
      {
        stripeSubscriptionId: null,
        currentPlan: 'free',
      },
      {
        where: {
          stripeCustomerId: payload.data.object.customer as string,
        },
      },
    );
  }
}
