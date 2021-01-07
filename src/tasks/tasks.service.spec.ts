import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { BuildsModule } from '../builds/builds.module';
import { DeploymentsModule } from '../deployments/deployments.module';
import { TasksService } from './tasks.service';
import { TaskRepository } from './entities/task.repository';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule, BuildsModule, DeploymentsModule],
      providers: [TasksService, TaskRepository],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
