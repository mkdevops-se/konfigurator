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

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  build_info_api_path?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  spring_profiles_active?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image_tag?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  build_timestamp?: string;
}
