import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { STRIPE_CLIENT } from '../../providers';
import Stripe from 'stripe';
import JwtAuthGuard from '../../../auth/guards/jwtAuth.guard';
import { ValidateUserResponseDto } from '../../../auth/dto/validate/response.dto';
import { CreateSubscriptionIntentDto } from '../../useCases/createSubscriptionIntent/request.dto';
import { CreateSubscriptionIntentUseCase } from '../../useCases/createSubscriptionIntent/useCase';

@Controller('stripe/subscription')
@ApiTags('Stripe')
export class CreateSubscriptionIntentController {
  constructor(
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly useCase: CreateSubscriptionIntentUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create subscription intent',
    description: 'Create subscription intent',
  })
  async create(
    @Req() { user }: { user: ValidateUserResponseDto },
    @Body() payload: CreateSubscriptionIntentDto,
  ) {
    const subscription = await this.useCase.execute({
      userId: user.id,
      payload,
    });

    return subscription;
  }
}
