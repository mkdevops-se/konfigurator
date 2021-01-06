import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  state: string;

  @IsObject()
  data: {
    target: {
      environment: string;
      deployment: string;
      external_url: string;
    };
  };
}
