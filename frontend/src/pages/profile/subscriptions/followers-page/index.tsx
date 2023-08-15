import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { useId } from '../../ui/ProfilePage';
import { SubscriptionsTemplatePage } from '../TemplatePage';
import { useFollowers } from './utils/useFollowers';

export const FollowersPage = () => {
  const id = useId();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFollowers(id);

  useLoadingBar(isLoading);

  return (
    <SubscriptionsTemplatePage
      title="Подписчики"
      canLoadMore={hasNextPage ?? false}
      loadMore={fetchNextPage}
      loadingMore={isFetchingNextPage}
      profiles={data}
    />
  );
};
export default FollowersPage;
