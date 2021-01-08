import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsObject()
  data: {
    target: {
      environment?: string;
      ocp_namespace: string;
      deployment: string;
      external_url: string;
    };
  };
}
