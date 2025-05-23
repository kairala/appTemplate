import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../../../app.module';
import { NotFoundException } from '@nestjs/common';
import { ShowFileUseCase } from './useCase';
import { createStorageFileFactory } from '../../../../../tests/helpers/factories/storageFile.factory';
import { faker } from '@faker-js/faker/.';

describe('ShowFileUseCase', () => {
  let module: TestingModule;
  let showFileUseCase: ShowFileUseCase;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    showFileUseCase = module.get<ShowFileUseCase>(ShowFileUseCase);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(showFileUseCase).toBeDefined();
  });

  describe('when the file does not exist', () => {
    it('should throw an error', async () => {
      const fileId = faker.string.uuid();

      await expect(showFileUseCase.execute({ id: fileId })).rejects.toThrow(
        new NotFoundException(),
      );
    });
  });

  describe('when the file exists', () => {
    it('should return the file', async () => {
      const file = await createStorageFileFactory();

      const result = await showFileUseCase.execute({ id: file.id });

      expect(result.id).toEqual(file.id);
    });
  });
});
