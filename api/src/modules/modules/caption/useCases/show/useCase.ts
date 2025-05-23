import { Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../../../types/useCase.interface';
import { CaptionDto } from '../../dto/base.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Caption } from '../../../../../db/models/caption/caption.model';

type Params = {
  userId: string;
  captionId: string;
};

@Injectable()
export class ShowCaptionUseCase implements UseCase<Params, CaptionDto> {
  constructor(
    @InjectModel(Caption)
    private readonly captionModel: typeof Caption,
  ) {}

  async execute({ userId, captionId }: Params): Promise<CaptionDto> {
    const caption = await this.captionModel.findOne({
      where: {
        id: captionId,
        userId,
      },
    });

    if (!caption) {
      throw new NotFoundException();
    }

    return {
      id: caption.id,
      userId: caption.userId,
      storageFileId: caption.storageFileId,
      text: caption.text,
      network: caption.network,
      processingTime: caption.processingTime,
      style: caption.style,
    };
  }
}
