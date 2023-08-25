import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';

export class GetReviewsDTO extends PaginationQueryDTO {
  @IsInt()
  @Type(() => Number)
  listId: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;
}
