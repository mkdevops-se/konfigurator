import { Injectable, Logger } from '@nestjs/common';
import { DeploymentRepository } from './deployment.repository';
import { Deployment } from './deployment.entity';
import { CreateDeploymentDto } from './dto/create-deployment.dto';

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

  async getOne(environment: string, name: string): Promise<Deployment> {
    return await this.deploymentsRepository.findEntity(environment, name);
  }

  async getAll(): Promise<Deployment[]> {
    return await this.deploymentsRepository.find();
  }

  async getAllIn(environment: string): Promise<Deployment[]> {
    return await this.deploymentsRepository.find({ environment });
  }

  async update(
    environment: string,
    name: string,
    partialEnv: Partial<Deployment>,
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
