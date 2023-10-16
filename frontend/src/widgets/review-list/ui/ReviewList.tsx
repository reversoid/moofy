import { Review as IReview } from '@/shared/api/types/review.type';
import LoadMore from '@/shared/components/LoadMore';
import { Review } from '@/widgets/review-list/ui/Review';
import { Text, styled } from '@nextui-org/react';
import { memo } from 'react';

const ReviewsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',
});

interface ReviewListProps {
  reviews?: IReview[];
  isUserOwner: boolean;
  loadMore?: () => void;
  canLoadMore?: boolean;
  loadingMore?: boolean;
  noReviewsText: string;
  onDeleteReview?: (reviewId: number) => void;
}

export const ReviewList = memo(
  ({
    reviews,
    isUserOwner,
    loadingMore,
    loadMore,
    canLoadMore,
    noReviewsText,
    onDeleteReview,
  }: ReviewListProps) => {
    return (
      <>
        <ReviewsContainer>
          {reviews?.map((review) => (
            <Review
              key={review.id}
              isUserOwner={isUserOwner}
              review={review}
              onDeleteReview={onDeleteReview}
            />
          ))}

          {reviews?.length === 0 ? (
            <Text color="$neutral">{noReviewsText}</Text>
          ) : null}
        </ReviewsContainer>

        {canLoadMore && <LoadMore loadMore={loadMore} loading={loadingMore} />}
      </>
    );
  },
);
