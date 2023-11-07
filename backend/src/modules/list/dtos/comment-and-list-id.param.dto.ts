import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { CommentIdParamDTO } from './comment-id.param.dto';

export class CommentAndListIdParamsDTO extends CommentIdParamDTO {
  @IsInt()
  @Type(() => Number)
  id: number;
}
