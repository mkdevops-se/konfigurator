import { Module } from '@nestjs/common';
import { DeploymentsModule } from '../deployments/deployments.module';
import { MockBuildInfoController } from './mock-build-info.controller';
import { MockBuildInfoService } from './mock-build-info.service';

@Module({
  imports: [DeploymentsModule],
  controllers: [MockBuildInfoController],
  providers: [MockBuildInfoService],
})
export class MockBuildInfoModule {}
