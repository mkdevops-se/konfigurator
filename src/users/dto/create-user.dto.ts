import {
  IsArray,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  display_name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  family_name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  given_name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsArray()
  @IsOptional()
  identities?: string[];

  @IsArray()
  @IsOptional()
  groups?: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  picture_url?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  locale?: string;

  @IsInt()
  @IsOptional()
  konfigurator_login_count?: number;

  @IsBoolean()
  @IsOptional()
  konfigurator_super_admin?: boolean;
}
