import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePasswordByTokenRequestDto } from './request.dto';
import { UseCase } from '../../../../types/useCase.interface';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../../../db/models/user/user.model';
import { ForgotPasswordToken } from '../../../../db/models/user/forgotPasswordToken.model';
import { Sequelize } from 'sequelize-typescript';
import { ProviderEnum } from '../../../../db/models/user/provider.enum';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdatePasswordByTokenUseCase
  implements UseCase<UpdatePasswordByTokenRequestDto, void>
{
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(ForgotPasswordToken)
    private readonly forgotPasswordTokenModel: typeof ForgotPasswordToken,
    private readonly sequelize: Sequelize,
  ) {}
  public execute(request: UpdatePasswordByTokenRequestDto): Promise<void> {
    const { token, newPassword } = request;

    return this.sequelize.transaction(async (transaction) => {
      const user = await this.userModel.findOne({
        attributes: ['id'],
        where: {
          provider: ProviderEnum.LOCAL,
          verifiedAt: {
            [Op.ne]: null,
          },
        },
        include: [
          {
            attributes: ['id', 'expiresAt'],
            model: ForgotPasswordToken,
            where: {
              token,
              usedAt: null,
              expiresAt: {
                [Op.gt]: new Date(),
              },
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

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.userModel.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            id: user.id,
          },
          transaction,
        },
      );

      await this.forgotPasswordTokenModel.update(
        {
          usedAt: new Date(),
        },
        {
          where: {
            userId: user.id,
            token,
          },
          transaction,
        },
      );
    });
  }
}
