import { listService } from '@/features/list/_api/list.service';
import { List } from '@/shared/api/types/list.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { transformResponse } from './transformResponse';
import { useEffect } from 'react';
import { useStore } from 'effector-react';
import { $userLists, setUserLists } from '@/entities/user-lists';

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

  useEffect(() => {
    const isOutdated = !data || isFetchingNextPage || !isFetchedAfterMount;
    if (isOutdated) {
      return;
    }

    const content = transformResponse(data);
    setUserLists(content);
  }, [isFetchedAfterMount, isFetchingNextPage]);

  return {
    data: userLists,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
