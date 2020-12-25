import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('environments')
export class EnvironmentsController {
  @Post()
  create(): string {
    return 'environment added';
  }

  @Get(':id')
  get(@Param() params): string {
    console.log(`Getting environment ${params.id}`);
    return `here are the environment with ID ${params.id}`;
  }

  @Get()
  getAll(): string {
    return 'here are all environments';
  }

  @Put(':id')
  update(@Param() params): string {
    console.log(`Updating environment ${params.id}`);
    return `here is the updated environment with ID ${params.id}`;
  }

  @Delete(':id')
  remove(@Param() params): string {
    console.log(`Deleting environment ${params.id}`);
    return `environment with ID ${params.id} deleted`;
  }
}
