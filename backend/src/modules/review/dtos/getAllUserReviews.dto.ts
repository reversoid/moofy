import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';

export class GetAllUserReviewsDTO extends PaginationQueryDTO {
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeFilms: boolean;
}
