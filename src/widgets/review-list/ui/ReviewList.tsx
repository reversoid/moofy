import { Review as IReview } from '@/shared/api/types/review.type';
import { IterableResponse } from '@/shared/api/types/shared';
import LoadMore from '@/shared/components/LoadMore';
import { Review } from '@/widgets/review/ui/Review';
import { styled } from '@nextui-org/react';
import { memo } from 'react';

const ReviewsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',
});

interface ReviewListProps {
  reviews?: IterableResponse<IReview>;
  isUserOwner: boolean;
  loadMore?: () => void;
  canLoadMore?: boolean;
  loadingMore?: boolean;
}

export const ReviewList = memo(
  ({ reviews, isUserOwner, loadingMore, loadMore }: ReviewListProps) => {
    return (
      <>
        <ReviewsContainer>
          {reviews?.items.map((review) => (
            <Review key={review.id} isUserOwner={isUserOwner} review={review} />
          ))}
        </ReviewsContainer>

        {reviews?.nextKey && (
          <LoadMore loadMore={loadMore} loading={loadingMore} />
        )}
      </>
    );
  },
);
