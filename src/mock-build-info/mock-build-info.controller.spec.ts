import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { DeploymentsModule } from '../deployments/deployments.module';
import { MockBuildInfoController } from './mock-build-info.controller';
import { MockBuildInfoService } from './mock-build-info.service';

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
