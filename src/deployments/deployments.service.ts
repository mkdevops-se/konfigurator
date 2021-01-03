import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { Environment } from '../interfaces/environment.interface';
import { Deployment as DeploymentInterface } from '../interfaces/deployment.interface';
import { DeploymentRepository } from './entities/deployment.repository';
import { Deployment } from './entities/deployment.entity';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';

@Injectable()
export class DeploymentsService {
  private readonly logger = new Logger(DeploymentsService.name);

  constructor(private deploymentsRepository: DeploymentRepository) {}

  async create(environment: string, deployment: CreateDeploymentDto) {
    return await this.deploymentsRepository.insertEntity({
      environment,
      ...deployment,
    } as Deployment);
  }

  async getAll(): Promise<Deployment[]> {
    return await this.deploymentsRepository.find();
  }

  async getAllIn(environment: string): Promise<Deployment[]> {
    return await this.deploymentsRepository.find({ environment });
  }

  async getAllInEnvWithExternalUrls(
    environment: Environment,
  ): Promise<DeploymentInterface[]> {
    const deployments: DeploymentInterface[] = await this.getAllIn(
      environment.name,
    );

    for (const deployment of deployments) {
      if (deployment.is_gateway) {
        deployment.external_url = `https://${deployment.name}-${deployment.ocp_namespace}.${environment.ocp_tenant_domain}`;
      }
    }

    if (environment.gateway_url) {
      for (const deployment of deployments) {
        if (!deployment.is_gateway) {
          deployment.external_url = path.join(
            environment.gateway_url,
            `/${deployment.name}/`,
          );
        }
      }
    }

    return deployments;
  }

  async getOne(environment: string, name: string): Promise<Deployment> {
    return await this.deploymentsRepository.findEntity(environment, name);
  }

  async update(
    environment: string,
    name: string,
    partialEnv: UpdateDeploymentDto,
  ): Promise<Deployment> {
    this.logger.debug(`Updating with ${JSON.stringify(partialEnv)}`);
    return await this.deploymentsRepository.updateEntity(
      environment,
      name,
      partialEnv,
    );
  }

  async delete(environment: string, name: string): Promise<Deployment> {
    const deletedEnv = await this.deploymentsRepository.removeEntity(
      environment,
      name,
    );
    deletedEnv.environment = environment;
    deletedEnv.name = name;
    return deletedEnv;
  }
}
