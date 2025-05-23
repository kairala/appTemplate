import { Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../../types/useCase.interface';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../../db/models/user/user.model';
import { MeResponseDto } from './response.dto';
import { StripeCustomer } from '../../../../db/models/user/stripeCustomer.model';

@Injectable()
export class MeUseCase implements UseCase<string, MeResponseDto> {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async execute(userId: string): Promise<MeResponseDto> {
    const user = await this.userModel.findByPk(userId, {
      attributes: ['id', 'email', 'name', 'verifiedAt'],
      include: [{ model: StripeCustomer, attributes: ['id', 'currentPlan'] }],
    });

    if (!user) {
      throw new NotFoundException();
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      verified: Boolean(user.verifiedAt),
      plan: user.stripeCustomer?.currentPlan || 'free',
    };
  }
}
