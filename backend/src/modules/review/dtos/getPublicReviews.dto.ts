import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';

export class GetReviewsDTO extends PaginationQueryDTO {
  @IsInt()
  @Type(() => Number)
  listId: number;
}
