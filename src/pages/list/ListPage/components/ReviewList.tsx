import ReviewItem from '@/features/list/components/Review/Review';
import {
  loadMoreReviews,
  loadMoreReviewsFx,
} from '@/models/lists/singleList/loadMoreReviews';
import { Review } from '@/shared/api/types/review.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { Button, Loading, Row, styled, Text } from '@nextui-org/react';
import { useEvent, useStore } from 'effector-react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const FilmsContainer = styled('div', {
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
  isUserOwner: boolean;
  listId: number;
}

const ReviewList = ({ reviews, isUserOwner, listId }: ReviewListProps) => {
  const navigate = useNavigate();

  const loading = useStore(loadMoreReviewsFx.pending);

  const handleLoadMore = () => {
    if (loading) {
      return;
    }
    loadMoreReviews({ lowerBound: reviews!.nextKey as DateAsString, listId });
  };

  return (
    <>
      <Row align="center" justify="flex-start" css={{ gap: '$8' }}>
        <Text h2 css={{ mb: '$5' }}>
          Фильмы
        </Text>
        {!reviews && <Loading size="md" type="default" />}
      </Row>
      {reviews?.items.length === 0 && !isUserOwner ? (
        <Text color="$neutral">Список пуст</Text>
      ) : (
        <>
          {isUserOwner && reviews && (
            <Button
              color={'gradient'}
              css={{ mb: '$8' }}
              onPress={() => navigate('add')}
            >
              Добавить
            </Button>
          )}

          <FilmsContainer>
            {reviews?.items.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </FilmsContainer>

          {reviews?.nextKey && (
            <LoadMoreContainer>
              <Button color={'gradient'} onClick={handleLoadMore}>
                {loading ? (
                  <Loading type="points" color="white" />
                ) : (
                  'Загрузить больше'
                )}
              </Button>
            </LoadMoreContainer>
          )}
        </>
      )}
    </>
  );
};

export default memo(ReviewList);
