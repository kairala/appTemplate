import { Injectable } from '@nestjs/common';
import { CaptionDto } from '../../dto/base.dto';
import { Caption } from '../../../../../db/models/caption/caption.model';
import { InjectModel } from '@nestjs/sequelize';
import { UseCase } from '../../../../../types/useCase.interface';

type Params = {
  userId: string;
};

@Injectable()
export class ListCaptionUseCase implements UseCase<Params, CaptionDto[]> {
  constructor(
    @InjectModel(Caption)
    private readonly captionModel: typeof Caption,
  ) {}

  async execute({ userId }: Params): Promise<CaptionDto[]> {
    const captions = await this.captionModel.findAll({
      where: { userId },
    });

    return captions.map((caption) => ({
      id: caption.id,
      userId: caption.userId,
      storageFileId: caption.storageFileId,
      text: caption.text,
      network: caption.network,
      processingTime: caption.processingTime,
      style: caption.style,
    }));
  }
}
