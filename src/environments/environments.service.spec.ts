import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { EnvironmentsModule } from './environments.module';
import { EnvironmentsService } from './environments.service';
import { EnvironmentRepository } from './entities/environment.repository';

describe('EnvironmentsService', () => {
  let service: EnvironmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, EnvironmentsModule],
      providers: [EnvironmentsService, EnvironmentRepository],
    }).compile();

    service = module.get<EnvironmentsService>(EnvironmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
