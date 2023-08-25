import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';

export class GetUserListsDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;
}
