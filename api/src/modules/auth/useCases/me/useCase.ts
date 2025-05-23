import { Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../../types/useCase.interface';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../../db/models/user/user.model';
import { MeResponseDto } from './response.dto';
import { StripeCustomer } from '../../../../db/models/user/stripeCustomer.model';
import { Caption } from '../../../../db/models/caption/caption.model';
import { Op } from 'sequelize';

@Injectable()
export class MeUseCase implements UseCase<string, MeResponseDto> {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Caption) private captionModel: typeof Caption,
  ) {}

  async execute(userId: string): Promise<MeResponseDto> {
    const user = await this.userModel.findByPk(userId, {
      attributes: ['id', 'email', 'name', 'verifiedAt'],
      include: [{ model: StripeCustomer, attributes: ['id', 'currentPlan'] }],
    });

    if (!user) {
      throw new NotFoundException();
    }

    const usedCaptionsToday = await this.captionModel.count({
      where: {
        userId: user.id,
        createdAt: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
          [Op.lt]: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      verified: Boolean(user.verifiedAt),
      plan: user.stripeCustomer?.currentPlan || 'free',
      usedCaptionsToday,
    };
  }
}
