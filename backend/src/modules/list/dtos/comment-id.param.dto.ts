import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CommentIdParamDTO {
  @IsInt()
  @Type(() => Number)
  commentId: number;
}
