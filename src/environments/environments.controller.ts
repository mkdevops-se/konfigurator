import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { ValidationPipe } from '../validation.pipe';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { EnvironmentsService } from './environments.service';
import { Environment } from './environment.entity';

@Controller('environments')
@UseFilters(HttpExceptionFilter)
export class EnvironmentsController {
  constructor(private environmentsService: EnvironmentsService) {}

  @Post()
  async create(
    @Body(new ValidationPipe())
    createEnvDto: CreateEnvironmentDto,
  ): Promise<Environment> {
    console.log(
      `Creating environment '${createEnvDto.name}' with ${JSON.stringify(
        createEnvDto,
      )} ...`,
    );
    const newEnv = await this.environmentsService.create(createEnvDto);
    console.debug(`Created environment: ${JSON.stringify(newEnv)}`);
    return newEnv;
  }

  @Get(':name')
  async get(@Param('name') name: string): Promise<Environment> {
    console.log(`Getting environment ${name} ...`);
    const oneEnv = await this.environmentsService.getOne(name);
    console.debug(`Got one environment: ${JSON.stringify(oneEnv)}`);
    return oneEnv;
  }

  @Get()
  async getAll(): Promise<Environment[]> {
    console.log(`Getting all environments ...`);
    const allEnvs = await this.environmentsService.getAll();
    console.debug(`Got all environments: ${JSON.stringify(allEnvs)}`);
    return allEnvs;
  }

  @Put(':name')
  async update(
    @Param('name') name: string,
    @Body(new ValidationPipe()) updateEnvDto: UpdateEnvironmentDto,
  ): Promise<Environment> {
    console.log(
      `Updating environment ${name} with ${JSON.stringify(updateEnvDto)} ...`,
    );
    const updatedEnv = await this.environmentsService.update(
      name,
      updateEnvDto,
    );
    console.debug(`Updated environment: ${JSON.stringify(updatedEnv)}`);
    return updatedEnv;
  }

  @Delete(':name')
  async delete(@Param('name') name: string): Promise<Environment> {
    console.log(`Deleting environment ${name} ...`);
    const deletedEnv = await this.environmentsService.delete(name);
    console.debug(`Deleted environment: ${JSON.stringify(deletedEnv)}`);
    return deletedEnv;
  }
}
