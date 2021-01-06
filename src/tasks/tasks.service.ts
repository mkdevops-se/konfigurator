import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './entities/task.repository';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private tasksRepository: TaskRepository,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  runInBackground(taskId: number) {
    const callback = async () => {
      this.schedulerRegistry.deleteTimeout(`tasks-${taskId}`);
      const task = await this.tasksRepository.findEntity(taskId);
      this.logger.warn(`Executing task ${JSON.stringify(task)} after 2000 ms!`);
    };

    let timeout = setTimeout(callback, 2000);
    this.schedulerRegistry.addTimeout(`tasks-${taskId}`, timeout);
  }

  async create(createTaskDto: CreateTaskDto) {
    const newTask = await this.tasksRepository.insertEntity(createTaskDto);
    this.logger.log(`Submitting task ${newTask.id} to ad-hoc scheduler ...`);
    this.runInBackground(newTask.id);
    return newTask;
  }

  getAll() {
    return this.tasksRepository.find();
  }

  getOne(id: number) {
    return this.tasksRepository.findEntity(id);
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.tasksRepository.updateEntity(id, updateTaskDto);
  }

  delete(id: number) {
    return this.tasksRepository.removeEntity(id);
  }
}
