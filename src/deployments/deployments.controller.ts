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
import { DeploymentsService } from './deployments.service';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';
import { Deployment } from './entities/deployment.entity';
import { Public } from '../common/guards/authenticated.guard';

@Controller('environments')
@UseFilters(HttpExceptionFilter)
export class DeploymentsController {
  private readonly logger = new Logger(DeploymentsController.name);

  constructor(private deploymentsService: DeploymentsService) {}

  @Post(':environment/deployments')
  async create(
    @Param('environment') environment: string,
    @Body(new ValidationPipe())
    createDeployDto: CreateDeploymentDto,
  ): Promise<Deployment> {
    this.logger.log(
      `Creating deployment '${
        createDeployDto.name
      }' in environment ${environment} with properties ${JSON.stringify(
        createDeployDto,
      )} ...`,
    );
    const {
      created_at,
      updated_at,
      ...newDeployment
    } = await this.deploymentsService.create(environment, createDeployDto);
    this.logger.debug(`Created deployment: ${JSON.stringify(newDeployment)}`);
    return newDeployment;
  }

  @Public()
  @Get(':environment/deployments/:name')
  async getOne(
    @Param('environment') environment: string,
    @Param('name') name: string,
  ): Promise<Deployment> {
    this.logger.log(
      `Getting deployment ${name} in environment ${environment} ...`,
    );
    const oneDeploy = await this.deploymentsService.getOne(
      environment,
      null,
      name,
    );
    this.logger.debug(`Got one deployment: ${JSON.stringify(oneDeploy)}`);
    return oneDeploy;
  }

  @Public()
  @Get(':environment/deployments')
  async getAll(
    @Param('environment') environment: string,
  ): Promise<Deployment[]> {
    this.logger.log(`Getting all deployments ...`);
    const deploysInEnv = await this.deploymentsService.getAllInEnv(environment);
    this.logger.debug(`Got all deployments: ${JSON.stringify(deploysInEnv)}`);
    return deploysInEnv;
  }

  @Put(':environment/deployments/:name')
  async update(
    @Param('environment') environment: string,
    @Param('name') name: string,
    @Body(new ValidationPipe()) updateDeployDto: UpdateDeploymentDto,
  ): Promise<Deployment> {
    this.logger.log(
      `Updating deployment ${name} in ${environment} with ${JSON.stringify(
        updateDeployDto,
      )} ...`,
    );
    const {
      updated_at,
      ...updatedDeploy
    } = await this.deploymentsService.update(
      environment,
      null,
      name,
      updateDeployDto,
    );
    this.logger.debug(`Updated deployment: ${JSON.stringify(updatedDeploy)}`);
    return updatedDeploy;
  }

  @Delete(':environment/deployments/:name')
  async delete(
    @Param('environment') environment: string,
    @Param('name') name: string,
  ): Promise<Deployment> {
    this.logger.log(`Deleting deployment ${name} in ${environment} ...`);
    const deletedDeploy = await this.deploymentsService.delete(
      environment,
      null,
      name,
    );
    this.logger.debug(`Deleted deployment: ${JSON.stringify(deletedDeploy)}`);
    return deletedDeploy;
  }
}
