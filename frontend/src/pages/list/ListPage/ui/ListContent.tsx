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
  reviews?: Review[];
  canLoadMoreReviews?: boolean;
  isUserOwner: boolean;
  isFetchingMore: boolean;
  loadMoreReviews?: () => void;
}

export const ListContent = ({
  reviews,
  isUserOwner,
  canLoadMoreReviews,
  loadMoreReviews,
  isFetchingMore,
}: ReviewListProps) => {
  const navigate = useNavigate();

  const handleSearchInput = useCallback((v: string) => console.log(v), []);

  return (
    <>
      <Row
        align="center"
        justify="space-between"
        css={{
          gap: '$8',
          '@xsMax': {
            flexDirection: 'column',
            ai: 'flex-start',
          },
        }}
      >
        <Text h2 css={{ mb: '$0' }}>
          Обзоры
        </Text>
        {isUserOwner && reviews && (
          <Button
            color={'gradient'}
            css={{ '@xsMax': { width: '100%' }, minWidth: '8rem' }}
            onPress={() => navigate('add')}
            size={'md'}
          >
            Добавить
          </Button>
        )}
      </Row>

      {reviews?.length === 0 && !isUserOwner ? (
        <Text color="$neutral">Коллекция пуста</Text>
      ) : (
        <>
          {reviews?.length && (
            <Row css={{ mb: '$8', mt: '$8' }}>
              <SearchInput onChange={handleSearchInput} />
            </Row>
          )}

          <ReviewList
            isUserOwner={isUserOwner}
            canLoadMore={canLoadMoreReviews}
            loadMore={loadMoreReviews}
            loadingMore={isFetchingMore}
            reviews={reviews}
          />
        </>
      )}
    </>
  );
};
