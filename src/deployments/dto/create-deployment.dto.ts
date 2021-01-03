import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateDeploymentDto {
  @IsString()
  @IsNotEmpty()
  ocp_namespace: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  is_gateway?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  memory_min?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  memory_max?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cpu_min?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cpu_max?: string;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  replicas_target?: number;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  replicas_current?: number;
}
