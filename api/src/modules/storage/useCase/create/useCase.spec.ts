import { Test, TestingModule } from '@nestjs/testing';
import { UploadFileUseCase } from './useCase';
import { S3Client } from '@aws-sdk/client-s3';
import { AppModule } from '../../../../app.module';
import { faker } from '@faker-js/faker/.';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { StorageFile } from '../../../../db/models/storage/storageFile.model';

jest.mock('@aws-sdk/client-s3', () => {
  const mockSend = jest.fn();

  return {
    S3Client: jest.fn(() => ({
      send: mockSend,
    })),
    PutObjectCommand: jest.fn(),
  };
});

const mockS3Client = new S3Client({});
const mockSend = (mockS3Client as any).send;

describe('UplaodFileUseCase', () => {
  let module: TestingModule;
  let uploadFileUseCase: UploadFileUseCase;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    uploadFileUseCase = module.get<UploadFileUseCase>(UploadFileUseCase);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(uploadFileUseCase).toBeDefined();
  });

  it('should upload the file and save it to database', async () => {
    const file = Buffer.from('file content');
    const fileName = `${faker.string.uuid()}-test.txt`;

    await uploadFileUseCase.execute({
      body: file,
      key: fileName,
      contentType: 'text/csv',
    });

    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: 'dummy_bucket',
      ContentType: 'text/csv',
      Key: `csv/export/${fileName}`,
      Body: file,
    });
    expect(mockSend).toHaveBeenCalled();

    const storageFile = await StorageFile.findOne({
      where: {
        providerRef: `csv/export/${fileName}`,
        provider: 'S3',
      },
    });

    expect(storageFile).toBeDefined();
  });
});
