import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentsController } from './environments.controller';
import { EnvironmentsService } from './environments.service';
import { EnvironmentRepository } from './entities/environment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EnvironmentRepository])],
  controllers: [EnvironmentsController],
  providers: [EnvironmentsService],
  exports: [EnvironmentsService],
})
export class EnvironmentsModule {}
