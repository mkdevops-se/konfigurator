import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Build } from './build.entity';
import { UpdateBuildDto } from '../dto/update-build.dto';

@EntityRepository(Build)
export class BuildRepository extends Repository<Build> {
  async insertEntity(item: Build): Promise<Build> {
    const entity = await this.findOne({
      image_name: item.image_name,
      image_tag: item.image_tag,
    });
    if (entity) {
      throw new ConflictException(
        `Build ${item.image_name}-${item.image_tag} already exist`,
      );
    }
    return await this.save(item);
  }

  async updateEntity(
    image_name: string,
    image_tag: string,
    item: UpdateBuildDto,
  ): Promise<Build> {
    const entity: Build = await this.findEntity(image_name, image_tag);
    return await this.save({ ...entity, ...item } as Build);
  }

  async findEntity(image_name: string, image_tag: string): Promise<Build> {
    const entity = await this.findOne({ image_name, image_tag });
    if (!entity) {
      throw new NotFoundException(
        `There's no build named ${image_name}-${image_tag}`,
      );
    }
    return entity;
  }

  async removeEntity(image_name: string, image_tag: string): Promise<Build> {
    return await this.remove(await this.findEntity(image_name, image_tag));
  }
}
