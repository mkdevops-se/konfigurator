import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentRepository } from '../environments/entities/environment.repository';
import { EnvironmentsModule } from '../environments/environments.module';
import { DeploymentsController } from './deployments.controller';
import { DeploymentsService } from './deployments.service';
import { DeploymentRepository } from './entities/deployment.repository';

@Module({
  imports: [
    EnvironmentsModule,
    TypeOrmModule.forFeature([DeploymentRepository, EnvironmentRepository]),
  ],
  controllers: [DeploymentsController],
  providers: [DeploymentsService],
  exports: [DeploymentsService],
})
export class DeploymentsModule {}
