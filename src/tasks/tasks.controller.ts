import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseFilters,
  Logger,
  Req,
  Redirect,
  Render,
} from '@nestjs/common';
import { RedirectResponse } from '@nestjs/core/router/router-response-controller';
import { Request } from 'express';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { TransformFormPipe } from '../common/pipes/transform-form.pipe';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { BulkCreateFetchBuildInfoTasksDto } from './dto/bulk-create-fetch-build-info-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { AuthExceptionFilter } from '../common/filters/auth-exceptions.filter';
import { Public } from '../common/guards/authenticated.guard';

@Controller('tasks')
@UseFilters(HttpExceptionFilter, AuthExceptionFilter)
export class TasksController {
  private readonly logger = new Logger(TasksController.name);
  private readonly processEnv;

  constructor(private readonly tasksService: TasksService) {
    this.processEnv = {
      SERVER_STARTUP_TIMESTAMP: process.env.SERVER_STARTUP_TIMESTAMP,
      IMAGE_TAG: process.env.IMAGE_TAG,
      COMMIT_LINK: process.env.COMMIT_LINK,
      BUILD_TIMESTAMP: process.env.BUILD_TIMESTAMP,
    };
  }

  @Post()
  @Redirect()
  create(
    @Body(new TransformFormPipe(), new ValidationPipe())
    createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<Task> | RedirectResponse {
    const contentType = req.headers['content-type'];
    const newTask = this.tasksService.create(createTaskDto);
    if (contentType.startsWith('application/x-www-form-urlencoded')) {
      let redirectUrl = '/';
      if (req.headers.referer) {
        // Practicality beats purity.
        redirectUrl = `${req.headers.referer}#${createTaskDto.data.target.ocp_namespace}/${createTaskDto.data.target.deployment}`;
      }
      return { statusCode: 302, url: redirectUrl };
    } else {
      return newTask;
    }
  }

  @Post('bulk')
  @Redirect()
  async bulkCreate(
    @Body(new ValidationPipe())
    bulkCreateFetchBuildInfoTasksDto: BulkCreateFetchBuildInfoTasksDto,
    @Req() req: Request,
  ): Promise<Task[] | RedirectResponse> {
    const contentType = req.headers['content-type'];
    const createTaskDtos = BulkCreateFetchBuildInfoTasksDto.toCreateTaskDtos(
      bulkCreateFetchBuildInfoTasksDto,
    );
    const newTasks: Task[] = [];
    for (const createTaskDto of createTaskDtos) {
      newTasks.push(await this.tasksService.create(createTaskDto));
    }
    if (contentType.startsWith('application/x-www-form-urlencoded')) {
      let redirectUrl = '/';
      if (req.headers.referer) {
        // Practicality beats purity.
        redirectUrl = `${req.headers.referer}#${bulkCreateFetchBuildInfoTasksDto.ocp_namespace}`;
      }
      return { statusCode: 302, url: redirectUrl };
    } else {
      return newTasks;
    }
  }

  @Public()
  @Get()
  @Render('tasks/tasks')
  async findAll(@Req() req: Request) {
    this.logger.log(`Getting all tasks ...`);
    const allTasks = await this.tasksService.getAll();
    this.logger.debug(`Got all tasks: ${JSON.stringify(allTasks)}`);
    return {
      user: req.user,
      title: 'Bakgrundsjobb',
      message: `Nedan listas alla bakgrundsjobb som Konfigurator-tjänsten schedulerat.`,
      processEnv: this.processEnv,
      tasks: allTasks,
    };
  }

  @Public()
  @Get(':id')
  getOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Task> {
    return this.tasksService.delete(+id);
  }
}
