import { IsString, IsOptional, IsNotEmpty, IsInt } from 'class-validator';

export class UpdateEnvironmentDto {
  @IsInt()
  @IsOptional()
  rank?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ocp_tenant_domain?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ocp_namespace_front?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ocp_namespace_backend?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ocp_namespace_restricted?: string;

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
  gateway_url?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  comment?: string;
}
