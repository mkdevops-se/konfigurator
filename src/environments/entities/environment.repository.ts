import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Environment } from './environment.entity';

@EntityRepository(Environment)
export class EnvironmentRepository extends Repository<Environment> {
  async insertEntity(item: Environment): Promise<Environment> {
    const entity = await this.findOne(item.name);
    if (entity) {
      throw new ConflictException(`Environment ${item.name} already exist`);
    }
    return await this.save(item);
  }

  async updateEntity(
    name: string,
    item: Partial<Environment>,
  ): Promise<Environment> {
    const entity = await this.findEntity(name);
    return await this.save({ ...entity, ...item });
  }

  async findEntity(name: string): Promise<Environment> {
    const entity = await this.findOne(name);
    if (!entity) {
      throw new NotFoundException(`There's no environment named ${name}`);
    }
    return entity;
  }

  async removeEntity(name: string): Promise<Environment> {
    return await this.remove(await this.findEntity(name));
  }
}
