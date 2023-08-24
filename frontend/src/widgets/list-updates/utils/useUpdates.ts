import { listService } from '@/features/list/api/list.service';
import { ListWithAdditionalInfo } from '@/shared/api/types/list.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { transformInfiniteIterableData } from '@/shared/lib/reactQueryAddons/transformInfiniteData';
import { useCachedInfiniteData } from '@/shared/lib/reactQueryAddons/useCachedInfiniteData';
import { useNewInfiniteData } from '@/shared/lib/reactQueryAddons/useNewInfiniteData';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const useUpdates = () => {
  const [updates, setUpdates] = useState<ListWithAdditionalInfo[]>();

  const result = useInfiniteQuery<
    IterableResponse<ListWithAdditionalInfo>,
    FetchError
  >({
    queryKey: ['Updates page'],
    queryFn: ({ pageParam }) => listService.getUpdates(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
  });

  useCachedInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setUpdates(content);
    }
  });

  useNewInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setUpdates(content);
    }
  });

  return {
    data: updates,
    isLoading: result.isLoading || result.isRefetching,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
};
