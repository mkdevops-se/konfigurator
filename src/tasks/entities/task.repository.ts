import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async insertEntity(item: CreateTaskDto): Promise<Task> {
    return await this.save(this.create(item as Partial<Task>));
  }

  async updateEntity(id: number, item: UpdateTaskDto): Promise<Task> {
    const entity: Task = await this.findEntity(id);
    return await this.save({ ...entity, ...item } as Task);
  }

  async findEntity(id: number): Promise<Task> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException(`There's no task with ID ${id}`);
    }
    return entity;
  }

  async removeEntity(id: number): Promise<Task> {
    return await this.remove(await this.findEntity(id));
  }
}
