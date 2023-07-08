import { useAuth } from '@/shared/hooks/useAuth';
import { ListContent } from './ListContent';
import { ListInfo } from './ListInfo';
import { Review } from '@/shared/api/types/review.type';
import { List } from '@/shared/api/types/list.type';

interface ListPageProps {
  list: List;
  reviews?: Review[];
  canLoadMoreReviews?: boolean;
  loadMoreReviews?: () => void;
  additionalInfo?: {
    isFavorite?: boolean;
  };
  isFetchingMore?: boolean;
}

export const PageContent = ({
  list,
  reviews,
  additionalInfo,
  canLoadMoreReviews,
  loadMoreReviews,
  isFetchingMore,
}: ListPageProps) => {
  const { userId } = useAuth();

  return (
    <>
      <ListInfo
        list={list}
        isUserOwner={userId === list.user.id}
        isFavorite={additionalInfo?.isFavorite}
      />
      <ListContent
        isUserOwner={userId === list.user.id}
        reviews={reviews}
        canLoadMoreReviews={canLoadMoreReviews}
        loadMoreReviews={loadMoreReviews}
        isFetchingMore={isFetchingMore ?? false}
      />
    </>
  );
};
