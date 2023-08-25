import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import { useId } from '../../ui/ProfilePage';
import { SubscriptionsTemplatePage } from '../TemplatePage';
import { useFollowers } from './utils/useFollowers';
import { useSearchFollowers } from './utils/useSearchFollowers';

export const FollowersPage = () => {
  const id = useId();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFollowers(id);

  useLoadingBar(isLoading);

  const {
    data: searchedProfiles,
    isSearchFinished,
    loading: searching,
    searchValue,
    setSearch,
  } = useSearchFollowers(id);

  const isSearch = !!isSearchFinished || (!!searchValue && !!searchedProfiles);
  useLoadingBar(isLoading, searching);

  return (
    <SubscriptionsTemplatePage
      title="Подписчики"
      canLoadMore={isSearch ? false : hasNextPage ?? false}
      loadMore={fetchNextPage}
      loadingMore={isSearch ? false : isFetchingNextPage}
      profiles={isSearch ? searchedProfiles : data}
      setSearch={setSearch}
    />
  );
};
export default FollowersPage;
