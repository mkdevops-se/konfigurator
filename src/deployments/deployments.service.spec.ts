import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DeploymentsModule } from './deployments.module';
import { DeploymentsService } from './deployments.service';
import { DeploymentRepository } from './entities/deployment.repository';

describe('DeploymentsService', () => {
  let service: DeploymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DeploymentsModule],
      providers: [DeploymentsService, DeploymentRepository],
    }).compile();

    service = module.get<DeploymentsService>(DeploymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
