import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { useId } from '../../ui/ProfilePage';
import { SubscriptionsTemplatePage } from '../TemplatePage';
import { useFollowed } from './utils/useFollowed';
import { useSearchFollowed } from './utils/useSearchFollowed';

export const FollowedPage = () => {
  const id = useId();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
    useFollowed(id);

  const {
    data: searchedProfiles,
    loading: searching,
    searchValue,
    setSearch,
  } = useSearchFollowed(id);

  const isSearch = Boolean(searchValue);

  useLoadingBar(isLoading, searching);

  return (
    <SubscriptionsTemplatePage
      title="Подписки"
      canLoadMore={isSearch ? false : hasNextPage ?? false}
      loadMore={fetchNextPage}
      loadingMore={isSearch ? false : isFetchingNextPage}
      profiles={isSearch ? searchedProfiles : data}
      setSearch={setSearch}
    />
  );
};
export default FollowedPage;
