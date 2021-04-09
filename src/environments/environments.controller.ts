import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Redirect,
  Req,
  UseFilters,
} from '@nestjs/common';
import { RedirectResponse } from '@nestjs/core/router/router-response-controller';
import { Request } from 'express';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { UpdateEnvironmentCommentDto } from './dto/update-environment-comment.dto';
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

  @Post(':name/comment')
  @Redirect()
  async createComment(
    @Param('name') name: string,
    @Body(new ValidationPipe())
    updateEnvCommentDto: UpdateEnvironmentCommentDto,
    @Req() req: Request,
  ): Promise<Environment | RedirectResponse> {
    updateEnvCommentDto.comment = updateEnvCommentDto.comment || null;
    this.logger.log(
      `Updating environment ${name} with ${JSON.stringify(
        updateEnvCommentDto,
      )} by ${req.user.user_id} ...`,
    );
    const localTimestamp = `${new Date().toLocaleString('sv-SE', {
      timeZone: 'Europe/Stockholm',
    })}`;
    const { updated_at, ...updatedEnv } = await this.environmentsService.update(
      name,
      {
        ...updateEnvCommentDto,
        comment_origin: `${req.user.user_id}, ${localTimestamp}`,
      },
    );
    this.logger.debug(`Updated environment: ${JSON.stringify(updatedEnv)}`);
    if (req.headers.referer) {
      return { statusCode: 302, url: req.headers.referer };
    } else {
      return updatedEnv;
    }
  }

  @Delete(':name')
  async delete(@Param('name') name: string): Promise<Environment> {
    this.logger.log(`Deleting environment ${name} ...`);
    const deletedEnv = await this.environmentsService.delete(name);
    this.logger.debug(`Deleted environment: ${JSON.stringify(deletedEnv)}`);
    return deletedEnv;
  }
}
