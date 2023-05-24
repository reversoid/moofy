import { Review as IReview } from '@/shared/api/types/review.type';
import _Dropdown from '@/shared/ui/Dropdown/Dropdown';
import { ReviewWrapper } from './ReviewWrapper';
import ReviewImageWithScore from './ReviewImageWithScore';
import ReviewContent from './ReviewContent';
import { memo } from 'react';
import { styled } from '@nextui-org/react';

const ButtonContainer = styled('div', {
  position: 'absolute',
  top: '$sm',
  right: '$sm',
});


export interface ReviewItemProps {
  review: IReview;
  topRightButton?: JSX.Element;
}

export const ReviewItem = memo(
  ({ review, topRightButton }: ReviewItemProps) => {
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
          <ButtonContainer>{topRightButton}</ButtonContainer>
        </ReviewWrapper>
      </>
    );
  },
);
