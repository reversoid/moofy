import { Review } from '@/shared/api/types/review.type';
import { ReviewList } from '@/widgets/review-list';
import {
  Button,
  Dropdown,
  Loading,
  Row,
  Text,
  styled,
} from '@nextui-org/react';
import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchReviews } from '../utils/hooks/useSearchReviews';
import { ListPageContext } from './ListPage';
import { SearchInput } from '../../../../shared/components/SearchInput';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { clearSearchReviews } from '../model/listSearchContent';
import { useUnmount } from '@/shared/hooks/useUnmount';
import RandomReviewModal from '@/features/search-random-review/ui/RandomReviewModal';
import { Shuffle } from '@/shared/Icons/Shuffle.icon';
import { useControllRandomReview } from '@/features/search-random-review/utils/useRandomModal';

interface ReviewListProps {
  reviews?: Review[];
  canLoadMoreReviews?: boolean;
  isUserOwner: boolean;
  isFetchingMore: boolean;
  loadMoreReviews?: () => void;
}

const Btn = styled(Button, {
  px: '0 !important',
  minWidth: '4.25rem !important',
});

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
  } = useSearchReviews(id!);

  const { review, isLoading, refetch, isOpen, setIsOpen } =
    useControllRandomReview();

  const handleSearchInput = useCallback((v: string) => setSearch(v), []);

  useLoadingBar(loadingSearch);

  const [exploded, setExploded] = useState(false);

  const handlePickRandom = () => {
    setExploded(false);
    refetch();
    setExploded(true);
  };

  useUnmount(() => {
    clearSearchReviews();
  });

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
          mt: '$8',
        }}
      >
        <Row css={{ flexGrow: 2, jc: 'space-between', ai: 'center' }}>
          <Text h2 css={{ mb: '$0' }}>
            Обзоры
          </Text>

          <Btn
            onPress={() => {
              setExploded(true);
              refetch();
            }}
            color="secondary"
            aria-label="Random review"
          >
            {isLoading ? (
              <Loading size="sm" color={'white'} />
            ) : (
              <Shuffle width="1.75rem" height="1.75rem" />
            )}
          </Btn>
        </Row>
        {review && (
          <RandomReviewModal
            review={review}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            pickRandom={handlePickRandom}
            isLoading={isLoading}
            exploded={exploded}
          />
        )}

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
            <SearchInput debouncedOnChange={handleSearchInput} />
          </Row>
        )}

        {searchValue && searchData ? (
          <ReviewList
            isUserOwner={isUserOwner}
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
