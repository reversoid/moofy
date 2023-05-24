import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateReviewDTO {
  @IsInt()
  reviewId: number;

  @IsOptional()
  @IsInt()
  score?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
