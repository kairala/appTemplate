import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { UseCase } from '../../../../types/useCase.interface';
import { VerifyEmailRequestDto } from './request.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../../db/models/user/user.model';
import { Sequelize } from 'sequelize-typescript';
import { ConfirmationToken } from '../../../../db/models/user/confirmationToken.model';

@Injectable()
export class VerifyEmailUseCase
  implements UseCase<VerifyEmailRequestDto, void>
{
  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(ConfirmationToken)
    private readonly confirmationTokenModel: typeof ConfirmationToken,
  ) {}

  async execute(request: VerifyEmailRequestDto): Promise<void> {
    return this.sequelize.transaction(async (transaction) => {
      const user = await this.userModel.findOne({
        attributes: ['id'],
        where: {
          verifiedAt: null,
        },
        include: [
          {
            attributes: ['id', 'expiresAt'],
            model: ConfirmationToken,
            where: {
              token: request.token,
              usedAt: null,
            },
            required: true,
          },
        ],
        transaction,
        useMaster: true,
      });

      if (!user) {
        throw new NotFoundException();
      }

      if (user.confirmationTokens[0].expiresAt < new Date()) {
        throw new PreconditionFailedException('auth.confirmationTokenExpired');
      }

      await this.userModel.update(
        {
          verifiedAt: new Date(),
        },
        {
          where: {
            id: user.id,
          },
          transaction,
        },
      );

      await this.confirmationTokenModel.update(
        {
          usedAt: new Date(),
        },
        {
          where: {
            id: user.confirmationTokens[0].id,
          },
          transaction,
        },
      );
    });
  }
}
