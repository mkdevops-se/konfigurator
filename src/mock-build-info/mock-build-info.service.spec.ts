import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DeploymentsModule } from '../deployments/deployments.module';
import { MockBuildInfoService } from './mock-build-info.service';

describe('MockBuildInfoService', () => {
  let service: MockBuildInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DeploymentsModule],
      providers: [MockBuildInfoService],
    }).compile();

    service = module.get<MockBuildInfoService>(MockBuildInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
