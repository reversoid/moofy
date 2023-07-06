import {
  $getMoreReviewsLoading,
  getMoreReviews,
} from '@/features/list/get-list';
import { Review } from '@/shared/api/types/review.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { ReviewList } from '@/widgets/review-list';
import { Button, Input, Row, Text, styled } from '@nextui-org/react';
import { useStore } from 'effector-react';
import { useNavigate } from 'react-router-dom';
import { SearchInput } from './SearchInput';
import { useCallback } from 'react';

interface ReviewListProps {
  reviews?: IterableResponse<Review>;
  isUserOwner: boolean;
  listId: number;
}

export const ListContent = ({
  reviews,
  isUserOwner,
  listId,
}: ReviewListProps) => {
  const moreReviewsLoading = useStore($getMoreReviewsLoading);
  const navigate = useNavigate();

  return (
    <>
      <Row align="center" justify="flex-start" css={{ gap: '$8' }}>
        <Text h2 css={{ mb: '$5' }}>
          Фильмы
        </Text>
      </Row>

      <Row css={{ mb: '$9' }}>
        <SearchInput
          onChange={useCallback((v: string) => console.log(v), [])}
        />
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

          <ReviewList
            isUserOwner={isUserOwner}
            canLoadMore={Boolean(reviews?.nextKey)}
            loadMore={
              reviews?.nextKey
                ? () => getMoreReviews({ listId, lowerBound: reviews.nextKey! })
                : undefined
            }
            loadingMore={moreReviewsLoading}
            reviews={reviews}
          />
        </>
      )}
    </>
  );
};
