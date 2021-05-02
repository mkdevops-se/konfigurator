import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EnvironmentInterface } from '../interfaces/environment.interface';
import { DeploymentInterface } from '../interfaces/deployment.interface';
import { EnvironmentsService } from '../environments/environments.service';
import { DeploymentRepository } from './entities/deployment.repository';
import { Deployment } from './entities/deployment.entity';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';

const formatKibanaErrorLogsUrl = (
  ocp_tenant_domain: string,
  kibana_index: string,
  deployment_name: string,
) => {
  return `https://kibana.${ocp_tenant_domain}/app/kibana#/discover?_g=(time:(from:now-1w,mode:relative,to:now))&_a=(columns:!(_source),filters:!(('%24state':(store:appState),meta:(alias:!n,disabled:!f,index:'project.${kibana_index}.*',key:level,negate:!f,params:!(warning,err),type:phrases,value:\\'warning,%20err\\'),query:(bool:(minimum_should_match:1,should:!((match_phrase:(level:warning)),(match_phrase:(level:err)))))),('%24state':(store:appState),meta:(alias:!n,disabled:!f,index:'project.${kibana_index}.*',key:kubernetes.container_name.raw,negate:!f,type:phrase,value:${deployment_name}),query:(match:(kubernetes.container_name.raw:(query:${deployment_name},type:phrase))))),index:'project.${kibana_index}.*',interval:auto,query:(match_all:()),sort:!('@timestamp',desc))`;
};

const getLogArchiveIndexForDeployment = (
  environment: EnvironmentInterface,
  deployment: DeploymentInterface,
) => {
  switch (deployment.ocp_namespace) {
    case environment.ocp_namespace_front:
      return environment.log_archive_index_front;
    case environment.ocp_namespace_backend:
      return environment.log_archive_index_backend;
    case environment.ocp_namespace_restricted:
      return environment.log_archive_index_restricted;
    case environment.ocp_namespace_public:
      return environment.log_archive_index_public;
    default:
      return null;
  }
};

const getLogArchiveIndexForDeploymentOrFail = (
  environment: EnvironmentInterface,
  deployment: DeploymentInterface,
) => {
  const logArchiveIndex = getLogArchiveIndexForDeployment(
    environment,
    deployment,
  );
  if (!logArchiveIndex) {
    throw new NotFoundException(
      `There's no log archive index matching ocp_namespace ${deployment.ocp_namespace}`,
    );
  }
  return logArchiveIndex;
};

@Injectable()
export class DeploymentsService {
  private readonly logger = new Logger(DeploymentsService.name);

  constructor(
    private deploymentsRepository: DeploymentRepository,
    private environmentsService: EnvironmentsService,
  ) {}

  async getLogArchiveErrorLogsUrl(
    environment_name: string | null,
    ocp_namespace: string | null,
    name: string,
  ): Promise<string> {
    const deployment = await this.deploymentsRepository.findEntity(
      environment_name,
      ocp_namespace,
      name,
    );
    const environment = await this.environmentsService.getOne(
      deployment.environment,
    );

    return formatKibanaErrorLogsUrl(
      environment.ocp_tenant_domain,
      getLogArchiveIndexForDeploymentOrFail(environment, deployment),
      deployment.name,
    );
  }

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
    environment: EnvironmentInterface,
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

      if (getLogArchiveIndexForDeployment(environment, deployment)) {
        deployment.error_logs_redirect_url = `/environments/${environment.name}/deployments/${deployment.name}/error_logs_redirect`;
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
