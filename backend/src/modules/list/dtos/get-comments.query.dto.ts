import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';

export class GetCommentsQueryDTO extends PaginationQueryDTO {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  commentId?: number;
}
