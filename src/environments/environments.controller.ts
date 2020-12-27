import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { EnvironmentsService } from './environments.service';
import { Environment } from '../interfaces/environment.interface';
import { HttpExceptionFilter } from '../http-exception.filter';
import { ValidationPipe } from '../validation.pipe';

@Controller('environments')
export class EnvironmentsController {
  constructor(private environmentsService: EnvironmentsService) {}

  @Post()
  @UseFilters(new HttpExceptionFilter())
  async create(
    @Body(new ValidationPipe())
    createEnvDto: CreateEnvironmentDto,
  ): Promise<Environment> {
    console.log(
      `Creating environment '${createEnvDto.name}' with body ${JSON.stringify(
        createEnvDto,
      )}`,
    );
    const newEnv = await this.environmentsService.create(createEnvDto);
    return newEnv;
  }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  async get(@Param('id') id: string): Promise<Environment> {
    console.log(`Getting environment ${id} ...`);
    const oneEnv = await this.environmentsService.getOne(id);
    return oneEnv;
  }

  @Get()
  @UseFilters(new HttpExceptionFilter())
  async getAll(): Promise<Environment[]> {
    const allEnvs = await this.environmentsService.getAll();
    console.log(`Getting all ${allEnvs.length} environments`);
    return allEnvs;
  }

  @Put(':id')
  @UseFilters(new HttpExceptionFilter())
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateEnvDto: UpdateEnvironmentDto,
  ): Promise<Environment> {
    console.log(
      `Updating environment ${id} with body ${JSON.stringify(updateEnvDto)}`,
    );
    const updatedEnv = await this.environmentsService.update(id, updateEnvDto);
    return updatedEnv;
  }

  @Delete(':id')
  @UseFilters(new HttpExceptionFilter())
  async delete(@Param('id') id: string): Promise<Environment> {
    console.log(`Deleting environment ${id}`);
    const deletedEnv = await this.environmentsService.delete(id);
    return deletedEnv;
  }
}
