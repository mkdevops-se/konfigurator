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
} from '@nestjs/common';
import { RedirectResponse } from '@nestjs/core/router/router-response-controller';
import { Request } from 'express';
import { HttpExceptionFilter } from '../http-exception.filter';
import { TransformFormPipe } from '../transform-form.pipe';
import { ValidationPipe } from '../validation.pipe';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { BulkCreateFetchBuildInfoTasksDto } from './dto/bulk-create-fetch-build-info-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
@UseFilters(HttpExceptionFilter)
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

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
      return { statusCode: 302, url: req.headers.referer || '/' };
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
      return { statusCode: 302, url: req.headers.referer || '/' };
    } else {
      return newTasks;
    }
  }

  @Get()
  getAll(): Promise<Task[]> {
    return this.tasksService.getAll();
  }

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
