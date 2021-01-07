import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BuildRepository } from './entities/build.repository';
import { Build } from './entities/build.entity';
import { CreateBuildDto } from './dto/create-build.dto';
import { UpdateBuildDto } from './dto/update-build.dto';

@Injectable()
export class BuildsService {
  private readonly logger = new Logger(BuildsService.name);

  constructor(private buildsRepository: BuildRepository) {}

  async create(image_name: string, build: CreateBuildDto): Promise<Build> {
    return await this.buildsRepository.insertEntity({
      image_name,
      ...build,
    } as Build);
  }

  async getAll(image_name: string): Promise<Build[]> {
    return await this.buildsRepository.find({ image_name });
  }

  async getOne(image_name: string, image_tag: string): Promise<Build> {
    return await this.buildsRepository.findEntity(image_name, image_tag);
  }

  async getOrCreate(
    image_name: string,
    build: CreateBuildDto,
  ): Promise<[Build, boolean]> {
    let buildEntity: Build;
    let created = false;
    try {
      buildEntity = await this.getOne(image_name, build.image_tag);
    } catch (err) {
      if (err instanceof NotFoundException) {
        buildEntity = await this.create(image_name, build);
        this.logger.debug(`Created new build ${JSON.stringify(buildEntity)}`);
        created = true;
      } else {
        throw err;
      }
    }
    return [buildEntity, created];
  }

  async update(
    image_name: string,
    image_tag: string,
    partialBuild: UpdateBuildDto,
  ): Promise<Build> {
    this.logger.debug(`Updating with ${JSON.stringify(partialBuild)}`);
    return await this.buildsRepository.updateEntity(
      image_name,
      image_tag,
      partialBuild,
    );
  }

  async delete(image_name: string, image_tag: string): Promise<Build> {
    const deletedBuild = await this.buildsRepository.removeEntity(
      image_name,
      image_tag,
    );
    deletedBuild.image_name = image_name;
    deletedBuild.image_tag = image_tag;
    return deletedBuild;
  }
}
