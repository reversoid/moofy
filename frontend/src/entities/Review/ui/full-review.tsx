import { Review as IReview } from '@/shared/api/types/review.type';
import _Dropdown from '@/shared/ui/Dropdown/Dropdown';
import ReviewImageWithScore from './review-image-with-score';
import ReviewContent from './review-content';
import { memo } from 'react';
import { styled } from '@nextui-org/react';
import { Card } from '@/shared/ui/Card';

const ButtonContainer = styled('div', {
  position: 'absolute',
  top: '$sm',
  right: '$sm',
});

export interface FullReviewProps {
  review: IReview;
  topRightButton?: JSX.Element;
}

export const FullReview = memo(
  ({ review, topRightButton }: FullReviewProps) => {
    return (
      <>
        <Card horizontal>
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
          <ButtonContainer>{topRightButton}</ButtonContainer>
        </Card>
      </>
    );
  },
);
