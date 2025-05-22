import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [HealthController],
  providers: [],
  imports: [TerminusModule, SequelizeModule.forFeature([])],
})
export class HealthModule {}
