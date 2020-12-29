import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeploymentsController } from './deployments.controller';
import { DeploymentsService } from './deployments.service';
import { DeploymentRepository } from './deployment.repository';
import { EnvironmentRepository } from '../environments/environment.repository';
import { EnvironmentsModule } from '../environments/environments.module';

@Module({
  imports: [
    EnvironmentsModule,
    TypeOrmModule.forFeature([EnvironmentRepository, DeploymentRepository]),
  ],
  controllers: [DeploymentsController],
  providers: [DeploymentsService],
  exports: [DeploymentsService],
})
export class DeploymentsModule {}
