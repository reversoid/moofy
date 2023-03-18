import { ReviewItem } from '@/entities/Review';
import { ReviewOwnerActions } from '@/features/review/review-owner-actions';
import { updateReview } from '@/features/review/update-review';
import { Review as IReview } from '@/shared/api/types/review.type';
import React, { FC, PropsWithChildren, memo } from 'react';

export interface ReviewProps {
  review: IReview;
}

export const Review: FC<ReviewProps> = memo(({ review }) => {
  return <ReviewItem review={review} children={<ReviewOwnerActions />} />;
});
