import { List } from '@/entities/List';
import { listService } from '@/features/list/_api/list.service';
import { CreateListModal } from '@/features/list/create-list';
import { getLists } from '@/features/list/get-lists';
import { List as IList } from '@/shared/api/types/list.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { useLoadingBar } from '@/shared/hooks/useLoadingBar';
import ListGrid from '@/widgets/list-grid/ui/ListGrid';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const transformResponse = (
  data: InfiniteData<IterableResponse<IList>>,
): IList[] => {
  return data.pages.reduce(
    (acc, value) => [...acc, ...value.items],
    [] as IList[],
  );
};

const useCollectionsPage = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchedAfterMount,
    isFetchingNextPage,
  } = useInfiniteQuery<IterableResponse<IList>, FetchError>({
    queryKey: ['Collections page'],
    queryFn: ({ pageParam }) => listService.getMyLists(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
  });

  return {
    data: data && transformResponse(data),
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

const CollectionsPage = () => {
  const [createListModal, setCreateListModal] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCollectionsPage();

  useLoadingBar(isLoading);

  return (
    <>
      <ListGrid
        items={data ?? []}
        canLoadMore={hasNextPage}
        loadMore={fetchNextPage}
        loadingMore={isFetchingNextPage}
        firstItem={
          <List
            onClick={() => setCreateListModal(true)}
            text="Создать коллекцию"
          />
        }
      />
      <CreateListModal
        isOpen={createListModal}
        setIsOpen={setCreateListModal}
      />
    </>
  );
};

export default CollectionsPage;
