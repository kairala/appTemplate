import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import * as request from 'supertest';
import { createStorageFileFactory } from '../../../../../tests/helpers/factories/storageFile.factory';

describe('DownloadFileController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });

  it('should return a redirect to the file URL', async () => {
    const storageFile = await createStorageFileFactory();

    const response = await request(app.getHttpServer())
      .get(`/file/${storageFile.id}`)
      .expect(302);

    expect(response.headers.location).toEqual(
      `https://dummy.cloudfront.net/${storageFile.providerRef}`,
    );
  });
});
