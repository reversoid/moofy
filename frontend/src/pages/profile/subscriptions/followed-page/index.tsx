import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { useId } from '../../ui/ProfilePage';
import { SubscriptionsTemplatePage } from '../TemplatePage';
import { useFollowed } from './utils/useFollowed';

export const FollowedPage = () => {
  const id = useId();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
    useFollowed(id);

  useLoadingBar(isLoading);

  return (
    <SubscriptionsTemplatePage
      title="Подписки"
      canLoadMore={hasNextPage ?? false}
      loadMore={fetchNextPage}
      loadingMore={isFetchingNextPage}
      profiles={data}
    />
  );
};
export default FollowedPage;
