import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StorageFile } from '../../db/models/storage/storageFile.model';
import { UploadFileUseCase } from './useCase/create/useCase';
import { ShowFileUseCase } from './useCase/show/useCase';
import { DownloadFileController } from './controller/download/controller';
import { GetFileAsStringUseCase } from './useCase/get/useCase';
import { UploadFileController } from './controller/upload/controller';

@Module({
  controllers: [UploadFileController, DownloadFileController],
  providers: [UploadFileUseCase, ShowFileUseCase, GetFileAsStringUseCase],
  imports: [SequelizeModule.forFeature([StorageFile])],
  exports: [UploadFileUseCase, GetFileAsStringUseCase, ShowFileUseCase],
})
export class StorageModule {}
