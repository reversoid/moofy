import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReviewDTO {
  @IsString()
  filmId: string;

  @IsInt()
  @IsOptional()
  score?: number | null;

  @IsInt()
  listId: number;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
