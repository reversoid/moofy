import { useUpdates } from '../../../widgets/list-updates/utils/useUpdates';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import CollectionsUpdatesList from '@/widgets/list-updates';

export const UpdatesPage = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useUpdates();

  useLoadingBar(isLoading);

  return (
    <>
      <CollectionsUpdatesList
        canLoadMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
        loadMore={fetchNextPage}
        data={data}
        loading={isLoading}
      />
    </>
  );
};

export default UpdatesPage;
