import { ReviewItem as ReviewItem } from '@/entities/Review';
import { getMoreReviews, getMoreReviewsFx } from '@/features/list/get-list';
import { Review } from '@/shared/api/types/review.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { Button, Loading, Row, Text, styled } from '@nextui-org/react';
import { useStore } from 'effector-react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const ReviewsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',
});

const LoadMoreContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mt: '$8',
});

interface ReviewListProps {
  reviews?: IterableResponse<Review>;
  listId: number;
  loadMore?: () => void;
  canLoadMore?: boolean;
  loadingMore?: boolean;
}

const ReviewList = ({ reviews, listId }: ReviewListProps) => {
  return (
    <>
      <ReviewsContainer>
        {reviews?.items.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ReviewsContainer>

      {reviews?.nextKey && (
        <LoadMoreContainer>
          <Button color={'gradient'} onClick={handleLoadMore}>
            {loadingMore ? (
              <Loading type="points" color="white" />
            ) : (
              'Загрузить больше'
            )}
          </Button>
        </LoadMoreContainer>
      )}
    </>
  );
};

export default memo(ReviewList);
