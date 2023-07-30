import { Review } from '@/shared/api/types/review.type';
import { ReviewList } from '@/widgets/review-list';
import { Button, Row, Text } from '@nextui-org/react';
import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchReviews } from '../utils/hooks/useSearchReviews';
import { ListPageContext } from './ListPage';
import { SearchInput } from '../../../../shared/components/SearchInput';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';

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
  const { id } = useContext(ListPageContext);
  const {
    loading: loadingSearch,
    searchValue,
    setSearch,
    data: searchData,
    loadMore: loadMoreSearch,
    canLoadMore: canLoadMoreSearch,
    loadingMore: searchLoadingMore,
    isSearchFinished,
  } = useSearchReviews(id!);

  const handleSearchInput = useCallback((v: string) => setSearch(v), []);

  useLoadingBar(loadingSearch)

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
            size={'lg'}
          >
            Добавить
          </Button>
        )}
      </Row>

      <>
        {Boolean(reviews?.length) && (
          <Row css={{ mb: '$8', mt: '$8' }}>
            <SearchInput onChange={handleSearchInput} />
          </Row>
        )}

        {isSearchFinished || (searchValue && searchData) ? (
          <ReviewList
            isUserOwner={isUserOwner}
            canLoadMore={canLoadMoreSearch}
            loadMore={loadMoreSearch}
            loadingMore={searchLoadingMore}
            reviews={searchData ?? []}
            noReviewsText="Обзоров не найдено"
          />
        ) : (
          <ReviewList
            isUserOwner={isUserOwner}
            canLoadMore={canLoadMoreReviews}
            loadMore={loadMoreReviews}
            loadingMore={isFetchingMore}
            reviews={reviews}
            noReviewsText="Коллекция пуста"
          />
        )}
      </>
    </>
  );
};
