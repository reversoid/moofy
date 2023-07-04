import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';

export class SearchProfileDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsString()
  @Type(() => String)
  username?: string;
}
