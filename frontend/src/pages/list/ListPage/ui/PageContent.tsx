import { useAuth } from '@/shared/hooks/useAuth';
import { ListContent } from './ListContent';
import { ListInfo } from './ListInfo';
import { Review } from '@/shared/api/types/review.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { List } from '@/shared/api/types/list.type';

interface ListPageProps {
  listWithContent: {
    reviews?: IterableResponse<Review>;
    list: List;
    additionalInfo?: {
      isFavorite?: boolean;
    };
  };
}

export const PageContent = ({
  listWithContent: { list, reviews, additionalInfo },
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
        listId={list.id}
      />
    </>
  );
};
