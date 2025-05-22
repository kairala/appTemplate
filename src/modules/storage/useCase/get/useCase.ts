import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  GetObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { UseCase } from '../../../../types/useCase.interface';

type Params = {
  fileKey: string;
};

@Injectable()
export class GetFileAsStringUseCase implements UseCase<Params, string> {
  constructor(private readonly configService: ConfigService) {}

  async execute({ fileKey }: Params): Promise<string> {
    const region = this.configService.getOrThrow<string>('AWS_REGION');
    const client = new S3Client({ region });

    const params: GetObjectCommandInput = {
      Bucket: this.configService.getOrThrow<string>('AWS_BUCKET_NAME'),
      Key: fileKey,
    };

    const command = new GetObjectCommand(params);
    const response = await client.send(command);
    const bodyContents = await response.Body?.transformToString();

    if (!bodyContents) {
      throw new Error('Failed to read file contents');
    }

    return bodyContents;
  }
}
