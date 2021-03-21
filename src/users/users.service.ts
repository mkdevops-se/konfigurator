import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './entities/user.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private usersRepository: UserRepository) {}

  async create(user: CreateUserDto): Promise<User> {
    return await this.usersRepository.insertEntity(user);
  }

  async getOne(user_id: string): Promise<User> {
    return await this.usersRepository.findEntity(user_id);
  }

  async getOrCreate(user: CreateUserDto): Promise<[User, boolean]> {
    let userEntity: User;
    let created = false;
    try {
      userEntity = await this.getOne(user.user_id);
    } catch (err) {
      if (err instanceof NotFoundException) {
        userEntity = await this.create(user);
        this.logger.debug(`Created new user ${JSON.stringify(userEntity)}`);
        created = true;
      } else {
        throw err;
      }
    }
    return [userEntity, created];
  }

  async update(user_id: string, partialUser: UpdateUserDto): Promise<User> {
    this.logger.debug(`Updating with ${JSON.stringify(partialUser)}`);
    return await this.usersRepository.updateEntity(user_id, partialUser);
  }
}
