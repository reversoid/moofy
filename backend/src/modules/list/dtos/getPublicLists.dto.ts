import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';

export class GetPublicListsDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  user?: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;
}
