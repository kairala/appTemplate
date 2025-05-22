import { IsString } from 'class-validator';

export class CreateSubscriptionIntentDto {
  @IsString()
  priceId: string;
}
