import { IsString } from 'class-validator';

export class UpdateEnvironmentCommentDto {
  @IsString()
  comment: string;
}
