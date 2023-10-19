import { ListContent } from './ListContent';
import { ListInfo } from './ListInfo';
import { Review } from '@/shared/api/types/review.type';
import { AdditinalInfo, List } from '@/shared/api/types/list.type';
import { useAuth } from '@/app';

interface ListPageProps {
  list: List;
  reviews?: Review[];
  canLoadMoreReviews?: boolean;
  loadMoreReviews?: () => void;
  additionalInfo?: AdditinalInfo;
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
        additionalInfo={additionalInfo}
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
