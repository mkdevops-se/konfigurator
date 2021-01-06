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
} from '@nestjs/common';
import { ValidationPipe } from '../validation.pipe';
import { HttpExceptionFilter } from '../http-exception.filter';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
@UseFilters(HttpExceptionFilter)
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  async getAll(): Promise<Task[]> {
    return await this.tasksService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.getOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.delete(+id);
  }
}
