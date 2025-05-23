import { Injectable, Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { InjectModel } from '@nestjs/sequelize';
import { StorageFile } from '../../../../db/models/storage/storageFile.model';
import { Transaction } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { UseCase } from '../../../../types/useCase.interface';

type Params = {
  body: string | Uint8Array | Buffer | Readable;
  key: string;
  contentType: string;
  userId: string;
};

@Injectable()
export class UploadFileUseCase implements UseCase<Params, StorageFile> {
  private readonly logger = new Logger(UploadFileUseCase.name);

  constructor(
    @InjectModel(StorageFile)
    private readonly storageFileModel: typeof StorageFile,
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize,
  ) {}

  public async execute({
    body,
    key,
    contentType,
    userId,
  }: Params): Promise<StorageFile> {
    const region = this.configService.getOrThrow<string>('AWS_REGION');
    const bucketName = this.configService.getOrThrow<string>('AWS_BUCKET_NAME');
    const client = new S3Client({ region });

    const command = new PutObjectCommand({
      Bucket: bucketName,
      ContentType: contentType,
      Key: key,
      Body: body,
    });

    await client.send<PutObjectCommandInput, PutObjectCommandOutput>(command);

    return this.sequelize.transaction(async (transaction: Transaction) => {
      return this.storageFileModel.create(
        {
          provider: 'S3',
          providerRef: key,
          mimetype: contentType,
          userId,
        },
        {
          transaction,
        },
      );
    });
  }
}
