import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateEnvironmentDto, UpdateEnvironmentDto } from './dto';
import { EnvironmentsService } from './environments.service';
import { Environment } from '../interfaces/environment.interface';

@Controller('environments')
export class EnvironmentsController {
  constructor(private environmentsService: EnvironmentsService) {}

  @Post()
  async create(
    @Body() createEnvironmentDto: CreateEnvironmentDto,
  ): Promise<Environment> {
    console.log(
      `Creating environment ${
        createEnvironmentDto.name
      } with body ${JSON.stringify(createEnvironmentDto)}`,
    );
    this.environmentsService.create(createEnvironmentDto);
    return createEnvironmentDto;
  }

  @Get(':id')
  get(@Param('id') id: string): string {
    console.log(`Getting environment ${id}`);
    return `here are the environment with ID ${id}`;
  }

  @Get()
  async getAll(): Promise<Environment[]> {
    return this.environmentsService.getAll();
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnvironmentDto: UpdateEnvironmentDto,
  ): string {
    console.log(
      `Updating environment ${id} with body ${JSON.stringify(
        updateEnvironmentDto,
      )}`,
    );
    return `here is the updated environment with ID ${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    console.log(`Deleting environment ${id}`);
    return `environment with ID ${id} deleted`;
  }
}
