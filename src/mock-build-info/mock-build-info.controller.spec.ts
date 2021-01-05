import { Test, TestingModule } from '@nestjs/testing';
import { MockBuildInfoController } from './mock-build-info.controller';
import { MockBuildInfoService } from './mock-build-info.service';
import { DeploymentsModule } from '../deployments/deployments.module';
import { AppModule } from '../app.module';

describe('MockBuildInfoController', () => {
  let controller: MockBuildInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DeploymentsModule],
      controllers: [MockBuildInfoController],
      providers: [MockBuildInfoService],
    }).compile();

    controller = module.get<MockBuildInfoController>(MockBuildInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
