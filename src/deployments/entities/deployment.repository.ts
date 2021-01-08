import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Deployment } from './deployment.entity';
import { UpdateDeploymentDto } from '../dto/update-deployment.dto';

@EntityRepository(Deployment)
export class DeploymentRepository extends Repository<Deployment> {
  async insertEntity(item: Deployment): Promise<Deployment> {
    const entity = await this.findOne({
      environment: item.environment,
      name: item.name,
    });
    if (entity) {
      throw new ConflictException(
        `Deployment ${item.name} already exist in ${item.environment}`,
      );
    }
    return await this.save(item);
  }

  async updateEntity(
    environment: string | null,
    ocp_namespace: string | null,
    name: string,
    item: UpdateDeploymentDto,
  ): Promise<Deployment> {
    const entity = await this.findEntity(environment, ocp_namespace, name);
    return await this.save({ ...entity, ...item });
  }

  async findEntity(
    environment: string | null,
    ocp_namespace: string | null,
    name: string,
  ): Promise<Deployment> {
    let entity: Deployment;
    if (environment && ocp_namespace) {
      entity = await this.findOne({ environment, ocp_namespace, name });
    } else {
      if (environment) {
        entity = await this.findOne({ environment, name });
      } else if (ocp_namespace) {
        entity = await this.findOne({ ocp_namespace, name });
      }
    }
    if (!entity) {
      throw new NotFoundException(
        `There's no deployment named ${name} in ${
          environment || ocp_namespace
        }`,
      );
    }
    return entity;
  }

  async removeEntity(
    environment: string | null,
    ocp_namespace: string | null,
    name: string,
  ): Promise<Deployment> {
    return await this.remove(
      await this.findEntity(environment, ocp_namespace, name),
    );
  }
}
