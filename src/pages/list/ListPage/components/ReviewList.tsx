import ReviewItem from '@/features/list/components/Review/Review';
import {
  loadMoreReviews,
  loadMoreReviewsFx,
} from '@/models/lists/singleList/loadMoreReviews';
import { Review } from '@/shared/api/types/review.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { Button, Loading, Row, Text, styled } from '@nextui-org/react';
import { useStore } from 'effector-react';
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

  const loadingMore = useStore(loadMoreReviewsFx.pending);

  useLoadingBar(loadingMore);

  const handleLoadMore = () => {
    if (loadingMore) {
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
      </Row>
      {reviews?.items.length === 0 && !isUserOwner ? (
        <Text color="$neutral">Коллекция пуста</Text>
      ) : (
        <>
          {isUserOwner && reviews && (
            <Button
              color={'gradient'}
              css={{ mb: '$8', '@xsMax': { width: '100%' } }}
              onPress={() => navigate('add')}
              size={'lg'}
            >
              Добавить
            </Button>
          )}

          <FilmsContainer>
            {reviews?.items.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                isUserOwner={isUserOwner}
              />
            ))}
          </FilmsContainer>

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
      )}
    </>
  );
};

export default memo(ReviewList);
