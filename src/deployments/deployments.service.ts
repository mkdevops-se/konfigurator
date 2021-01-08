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

  async getAllInEnv(environment: string): Promise<Deployment[]> {
    return await this.deploymentsRepository.find({ environment });
  }

  async getAllInEnvWithExternalUrls(
    environment: Environment,
  ): Promise<DeploymentInterface[]> {
    const deployments: DeploymentInterface[] = await this.deploymentsRepository.find(
      {
        where: { environment: environment.name },
        select: [
          'environment',
          'ocp_namespace',
          'name',
          'is_gateway',
          'memory_min',
          'memory_max',
          'cpu_min',
          'cpu_max',
          'replicas_target',
          'replicas_current',
          'spring_profiles_active',
          'image_tag',
          'build_timestamp',
          'updated_at',
        ],
      },
    );

    for (const deployment of deployments) {
      if (deployment.updated_at) {
        deployment.update_timestamp = deployment.updated_at
          .toISOString()
          .replace(/.000Z$/, 'Z');
      }
    }

    for (const deployment of deployments) {
      if (deployment.is_gateway) {
        deployment.external_url = `https://${deployment.name}-${deployment.ocp_namespace}.${environment.ocp_tenant_domain}`;
      }
    }

    if (environment.gateway_url) {
      for (const deployment of deployments) {
        if (!deployment.is_gateway) {
          deployment.external_url = `${environment.gateway_url.replace(
            /\/$/,
            '',
          )}/${deployment.name}/`;
        }
      }
    }

    return deployments;
  }

  async getOne(
    environment: string | null,
    ocp_namespace: string | null,
    name: string,
  ): Promise<Deployment> {
    return await this.deploymentsRepository.findEntity(
      environment,
      ocp_namespace,
      name,
    );
  }

  async update(
    environment: string | null,
    ocp_namespace: string | null,
    name: string,
    partialEnv: UpdateDeploymentDto,
  ): Promise<Deployment> {
    this.logger.debug(`Updating with ${JSON.stringify(partialEnv)}`);
    return await this.deploymentsRepository.updateEntity(
      environment,
      ocp_namespace,
      name,
      partialEnv,
    );
  }

  async delete(
    environment: string | null,
    ocp_namespace: string | null,
    name: string,
  ): Promise<Deployment> {
    const deletedEnv = await this.deploymentsRepository.removeEntity(
      environment,
      ocp_namespace,
      name,
    );
    deletedEnv.environment = deletedEnv.environment || environment;
    deletedEnv.ocp_namespace = deletedEnv.ocp_namespace || ocp_namespace;
    deletedEnv.name = name;
    return deletedEnv;
  }
}
