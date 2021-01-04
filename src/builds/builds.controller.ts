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
import { HttpExceptionFilter } from '../http-exception.filter';
import { ValidationPipe } from '../validation.pipe';
import { BuildsService } from './builds.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { UpdateBuildDto } from './dto/update-build.dto';
import { Build } from './entities/build.entity';

@Controller('builds')
@UseFilters(HttpExceptionFilter)
export class BuildsController {
  private readonly logger = new Logger(BuildsController.name);

  constructor(private readonly buildsService: BuildsService) {}

  @Post(':image_name')
  async create(
    @Param('image_name') image_name: string,
    @Body(new ValidationPipe()) createBuildDto: CreateBuildDto,
  ): Promise<Build> {
    this.logger.log(
      `Creating build for '${image_name}' with ${JSON.stringify(
        createBuildDto,
      )} ...`,
    );
    const newBuild = await this.buildsService.create(
      image_name,
      createBuildDto,
    );
    this.logger.debug(`Created build: ${JSON.stringify(newBuild)}`);
    return newBuild;
  }

  @Get(':image_name')
  async findAll(@Param('image_name') image_name: string): Promise<Build[]> {
    this.logger.log(`Getting all builds for ${image_name} ...`);
    const allBuildsForImage = await this.buildsService.getAll(image_name);
    this.logger.debug(
      `Got all builds for ${image_name}: ${JSON.stringify(allBuildsForImage)}`,
    );
    return allBuildsForImage;
  }

  @Get(':image_name/:image_tag')
  async findOne(
    @Param('image_name') image_name: string,
    @Param('image_tag') image_tag: string,
  ): Promise<Build> {
    this.logger.log(`Getting build ${image_name}-${image_tag} ...`);
    const oneBuild = await this.buildsService.getOne(image_name, image_tag);
    this.logger.debug(`Got one build: ${JSON.stringify(oneBuild)}`);
    return oneBuild;
  }

  @Put(':image_name/:image_tag')
  async update(
    @Param('image_name') image_name: string,
    @Param('image_tag') image_tag: string,
    @Body(new ValidationPipe()) updateBuildDto: UpdateBuildDto,
  ): Promise<Build> {
    this.logger.log(
      `Updating build ${image_name}-${image_tag} with ${JSON.stringify(
        updateBuildDto,
      )} ...`,
    );
    const updatedBuild = await this.buildsService.update(
      image_name,
      image_tag,
      updateBuildDto,
    );
    this.logger.debug(`Updated build: ${JSON.stringify(updatedBuild)}`);
    return updatedBuild;
  }

  @Delete(':image_name/:image_tag')
  remove(
    @Param('image_name') image_name: string,
    @Param('image_tag') image_tag: string,
  ): Promise<Build> {
    return this.buildsService.delete(image_name, image_tag);
  }
}
