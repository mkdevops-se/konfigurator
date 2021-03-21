import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { EnvironmentsService } from './environments.service';
import { Environment } from './entities/environment.entity';
import { Public } from '../common/guards/authenticated.guard';

@Controller('environments')
@UseFilters(HttpExceptionFilter)
export class EnvironmentsController {
  private readonly logger = new Logger(EnvironmentsController.name);

  constructor(private environmentsService: EnvironmentsService) {}

  @Post()
  async create(
    @Body(new ValidationPipe())
    createEnvDto: CreateEnvironmentDto,
  ): Promise<Environment> {
    this.logger.log(
      `Creating environment '${createEnvDto.name}' with ${JSON.stringify(
        createEnvDto,
      )} ...`,
    );
    const {
      updated_at,
      created_at,
      ...newEnv
    } = await this.environmentsService.create(createEnvDto);
    this.logger.debug(`Created environment: ${JSON.stringify(newEnv)}`);
    return newEnv;
  }

  @Public()
  @Get()
  async getAll(): Promise<Environment[]> {
    this.logger.log(`Getting all environments ...`);
    const allEnvs = await this.environmentsService.getAll();
    this.logger.debug(`Got all environments: ${JSON.stringify(allEnvs)}`);
    return allEnvs;
  }

  @Public()
  @Get(':name')
  async getOne(@Param('name') name: string): Promise<Environment> {
    this.logger.log(`Getting environment ${name} ...`);
    const oneEnv = await this.environmentsService.getOne(name);
    this.logger.debug(`Got one environment: ${JSON.stringify(oneEnv)}`);
    return oneEnv;
  }

  @Put(':name')
  async update(
    @Param('name') name: string,
    @Body(new ValidationPipe()) updateEnvDto: UpdateEnvironmentDto,
  ): Promise<Environment> {
    this.logger.log(
      `Updating environment ${name} with ${JSON.stringify(updateEnvDto)} ...`,
    );
    const { updated_at, ...updatedEnv } = await this.environmentsService.update(
      name,
      updateEnvDto,
    );
    this.logger.debug(`Updated environment: ${JSON.stringify(updatedEnv)}`);
    return updatedEnv;
  }

  @Delete(':name')
  async delete(@Param('name') name: string): Promise<Environment> {
    this.logger.log(`Deleting environment ${name} ...`);
    const deletedEnv = await this.environmentsService.delete(name);
    this.logger.debug(`Deleted environment: ${JSON.stringify(deletedEnv)}`);
    return deletedEnv;
  }
}
