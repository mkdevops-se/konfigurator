import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Deployment } from './deployment.entity';

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
    environment: string,
    name: string,
    item: Partial<Deployment>,
  ): Promise<Deployment> {
    const entity = await this.findEntity(environment, name);
    return await this.save({ ...entity, ...item });
  }

  async findEntity(environment: string, name: string): Promise<Deployment> {
    const entity = await this.findOne({ environment, name });
    if (!entity) {
      throw new NotFoundException(
        `There's no deployment named ${name} in ${environment}`,
      );
    }
    return entity;
  }

  async removeEntity(environment: string, name: string): Promise<Deployment> {
    return await this.remove(await this.findEntity(environment, name));
  }
}
