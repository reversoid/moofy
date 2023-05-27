import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';

export class GetPublicUserListsDTO extends PaginationQueryDTO {
  @IsInt()
  @Type(() => Number)
  user: number;
}
