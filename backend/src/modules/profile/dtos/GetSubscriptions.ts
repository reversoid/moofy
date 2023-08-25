import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';

export class GetSubscriptionsDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;
}
