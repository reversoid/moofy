import { $userLists, setUserLists } from '@/entities/user-lists';
import { listService } from '@/features/list/_api/list.service';
import { List } from '@/shared/api/types/list.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { transformInfiniteIterableData } from '@/shared/lib/reactQueryAddons/transformInfiniteData';
import { useNewInfiniteData } from '@/shared/lib/reactQueryAddons/useNewInfiniteData';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from 'effector-react';

export const useCollectionsPage = () => {
  const userLists = useStore($userLists);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchedAfterMount,
    isFetchingNextPage,
  } = useInfiniteQuery<IterableResponse<List>, FetchError>({
    queryKey: ['Collections page'],
    queryFn: ({ pageParam }) =>
      listService.getMyLists(pageParam, pageParam == undefined ? 19 : 20),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
  });

  useNewInfiniteData(data, isFetchingNextPage, isFetchedAfterMount, () => {
    if (data) {
      const content = transformInfiniteIterableData(data);
      setUserLists(content);
    }
  });

  return {
    data: userLists,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
