import { Injectable, Logger } from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { EnvironmentRepository } from './environment.repository';
import { Environment } from './environment.entity';

@Injectable()
export class EnvironmentsService {
  private readonly logger = new Logger(EnvironmentsService.name);

  constructor(private environmentsRepository: EnvironmentRepository) {}

  async create(environment: CreateEnvironmentDto) {
    return await this.environmentsRepository.insertEntity(
      environment as Environment,
    );
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
    this.logger.debug(`Updating with ${JSON.stringify(partialEnv)}`);
    return await this.environmentsRepository.updateEntity(name, partialEnv);
  }

  async delete(name: string): Promise<Environment> {
    const deletedEnv = await this.environmentsRepository.removeEntity(name);
    deletedEnv.name = name;
    return deletedEnv;
  }
}
