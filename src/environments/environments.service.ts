import { Injectable } from '@nestjs/common';
import { EnvironmentRepository } from './environment.repository';
import { Environment } from './environment.entity';

@Injectable()
export class EnvironmentsService {
  constructor(private environmentsRepository: EnvironmentRepository) {}

  async create(environment: Environment) {
    const newEnv = await this.environmentsRepository.insertEntity(environment);
    return newEnv;
  }

  async getOne(name: string): Promise<Environment> {
    return await this.environmentsRepository.findEntity(name);
  }

  async getAll(): Promise<Environment[]> {
    return await this.environmentsRepository.find();
  }

  async update(
    name: string,
    partialEnv: Partial<Environment>,
  ): Promise<Environment> {
    console.log(`Updating with ${JSON.stringify(partialEnv)}`);
    const updatedEnv = await this.environmentsRepository.updateEntity(
      name,
      partialEnv,
    );
    return updatedEnv;
  }

  async delete(name: string): Promise<Environment> {
    const deletedEnv = await this.environmentsRepository.removeEntity(name);
    return deletedEnv;
  }
}
