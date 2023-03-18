import { Review as IReview } from '@/shared/api/types/review.type';
import _Dropdown from '@/shared/ui/Dropdown/Dropdown';
import { ReviewWrapper } from './ReviewWrapper';
import ReviewImageWithScore from './ReviewImageWithScore';
import ReviewContent from './ReviewContent';
import { PropsWithChildren, memo } from 'react';

export interface ReviewItemProps extends PropsWithChildren {
  review: IReview;
}

export const ReviewItem = memo(({ review, children }: ReviewItemProps) => {
  return (
    <>
      <ReviewWrapper>
        <ReviewImageWithScore
          imgSrc={review.film.posterPreviewUrl}
          score={review.score}
        />

        <ReviewContent
          description={review.description}
          filmId={review.film.id}
          filmName={review.film.name}
          filmYear={review.film.year}
        />
        {children}
      </ReviewWrapper>
    </>
  );
});
