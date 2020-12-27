import { EntityRepository, Repository } from 'typeorm';
import { Environment } from './environment.entity';

@EntityRepository(Environment)
export class EnvironmentRepository extends Repository<Environment> {
  async insertEntity(item: Environment): Promise<Environment> {
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
    return await this.findOneOrFail(name);
  }

  async removeEntity(name: string): Promise<Environment> {
    return await this.remove(await this.findEntity(name));
  }
}
