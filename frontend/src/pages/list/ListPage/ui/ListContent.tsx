import RandomReviewModal from '@/features/search-random-review';
import { useRandomModal } from '@/features/search-random-review/';
import RandomReviewBtn from '@/features/search-random-review/ui/RandomReviewBtn';
import { Review } from '@/shared/api/types/review.type';
import { SearchInput } from '@/shared/components/SearchInput';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { useUnmount } from '@/shared/hooks/useUnmount';
import { ReviewList } from '@/widgets/review-list';
import { Button, Row, Text, styled } from '@nextui-org/react';
import { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearSearchReviews } from '../model/listSearchContent';
import { useSearchReviews } from '../utils/hooks/useSearchReviews';
import { ListPageContext } from './ListPage';

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

  const { review, isLoading, getRandomReview, isModalOpen, setIsModalOpen } =
    useRandomModal(Number(id));

  const handleSearchInput = useCallback((v: string) => setSearch(v), []);

  useLoadingBar(loadingSearch);

  useUnmount(() => {
    clearSearchReviews();
  });

  const openModal = () => {
    setIsModalOpen(true);
    getRandomReview();
  };

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
          {reviews && reviews.length > 0 && (
            <RandomReviewBtn onPress={openModal} isLoading={isLoading} />
          )}
        </Row>
        {review && (
          <RandomReviewModal
            isModalOpen={isModalOpen}
            review={review}
            setIsModalOpen={setIsModalOpen}
            onPickRandom={getRandomReview}
            isLoading={isLoading}
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
