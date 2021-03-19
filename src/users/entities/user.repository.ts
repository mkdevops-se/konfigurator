import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async insertEntity(item: User): Promise<User> {
    const entity = await this.findOne({
      user_id: item.user_id,
    });
    if (entity) {
      throw new ConflictException(`User ${item.user_id} already exist`);
    }
    return await this.save(item);
  }

  async updateEntity(user_id: string, item: UpdateUserDto): Promise<User> {
    const entity: User = await this.findEntity(user_id);
    return await this.save({ ...entity, ...item } as User);
  }

  async findEntity(user_id: string): Promise<User> {
    const entity = await this.findOne({ user_id });
    if (!entity) {
      throw new NotFoundException(`There's no user with ID ${user_id}`);
    }
    return entity;
  }

  async removeEntity(user_id: string): Promise<User> {
    return await this.remove(await this.findEntity(user_id));
  }
}
