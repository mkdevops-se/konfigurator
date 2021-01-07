import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class UpdateDeploymentDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ocp_namespace?: string;

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
