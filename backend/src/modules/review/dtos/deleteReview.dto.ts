import { IsInt } from 'class-validator';

export class DeleteReviewDTO {
  @IsInt()
  reviewId: number;
}
