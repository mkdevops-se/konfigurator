import { IsString, IsOptional, IsNotEmpty, IsInt } from 'class-validator';

export class CreateEnvironmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsOptional()
  rank?: number;

  @IsString()
  @IsNotEmpty()
  ocp_tenant_domain: string;

  @IsString()
  @IsNotEmpty()
  ocp_namespace_front: string;

  @IsString()
  @IsNotEmpty()
  ocp_namespace_backend: string;

  @IsString()
  @IsNotEmpty()
  ocp_namespace_restricted: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ocp_namespace_public?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  mq_url?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  mq_namespace?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  db_url?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  default_spring_profiles?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  login_url?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  comment?: string;
}
