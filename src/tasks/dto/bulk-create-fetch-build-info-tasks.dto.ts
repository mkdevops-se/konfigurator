import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

enum FetchBuildInfoAction {
  FETCH_BUILD_INFO = 'fetch_build_info',
}

export class BulkCreateFetchBuildInfoTasksDto {
  @IsString()
  @IsEnum(FetchBuildInfoAction)
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  environment?: string;

  @IsString()
  @IsNotEmpty()
  ocp_namespace: string;

  @IsString()
  @IsNotEmpty()
  deployments: string;

  @IsString()
  @IsNotEmpty()
  external_urls: string;

  public static toCreateTaskDtos(
    bulkCreateFetchBuildInfoTasksDto: BulkCreateFetchBuildInfoTasksDto,
  ): CreateTaskDto[] {
    const environment = bulkCreateFetchBuildInfoTasksDto.environment;
    const ocp_namespace = bulkCreateFetchBuildInfoTasksDto.ocp_namespace;

    const deployments = bulkCreateFetchBuildInfoTasksDto.deployments
      .replace(/,$/, '')
      .split(',');
    const external_urls = bulkCreateFetchBuildInfoTasksDto.external_urls
      .replace(/,$/, '')
      .split(',');

    if (deployments.length !== external_urls.length) {
      throw new Error(
        `Broken bulk create, ${JSON.stringify(
          deployments,
        )} misaligned with ${JSON.stringify(external_urls)}`,
      );
    }

    const createTaskDtos: CreateTaskDto[] = [];

    for (let i = 0; i < deployments.length; i++) {
      createTaskDtos.push({
        action: bulkCreateFetchBuildInfoTasksDto.action,
        data: {
          target: {
            environment,
            ocp_namespace,
            deployment: deployments[i],
            external_url: external_urls[i],
          },
        },
      });
    }

    return createTaskDtos;
  }
}
