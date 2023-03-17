import { Review } from '@/shared/api/types/review.type';
import _Dropdown from '@/shared/ui/Dropdown/Dropdown';
import { ReviewWrapper } from './ReviewWrapper';
import ReviewImageWithScore from './ReviewImageWithScore';
import ReviewContent from './ReviewContent';

export interface ReviewItemProps {
  review: Review;
}

const Review = ({ review }: ReviewItemProps) => {
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
      </ReviewWrapper>
    </>
  );
};

export default Review;
