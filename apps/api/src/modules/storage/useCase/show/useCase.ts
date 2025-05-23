import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StorageFile } from '../../../../db/models/storage/storageFile.model';
import { UseCase } from '../../../../types/useCase.interface';

type Params = {
  id: string;
};

@Injectable()
export class ShowFileUseCase implements UseCase<Params, StorageFile> {
  private readonly logger = new Logger(ShowFileUseCase.name);

  constructor(
    @InjectModel(StorageFile)
    private readonly storageFileModel: typeof StorageFile,
  ) {}

  public async execute({ id }: Params): Promise<StorageFile> {
    const file = await this.storageFileModel.findByPk(id, {
      useMaster: false,
    });

    if (!file) {
      throw new NotFoundException();
    }

    return file;
  }
}
