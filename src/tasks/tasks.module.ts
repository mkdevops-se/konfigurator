import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskRepository } from './entities/task.repository';
import { BuildsModule } from '../builds/builds.module';
import { DeploymentsModule } from '../deployments/deployments.module';
import { SchedulerRegistry } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    HttpModule,
    BuildsModule,
    DeploymentsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, SchedulerRegistry],
})
export class TasksModule {}
