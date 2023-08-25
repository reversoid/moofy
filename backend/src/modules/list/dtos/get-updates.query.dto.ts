import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';

export enum Order {
  'created' = 'created',
  'updated' = 'updated',
}

export class GetUpdatesQueryDTO extends PaginationQueryDTO {
  @IsOptional()
  @IsEnum(Order)
  order?: Order;
}
