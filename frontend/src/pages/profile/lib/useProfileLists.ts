import { Profile } from '@/shared/api/types/profile.type';
import { $profileLists, setProfileLists } from '../model/profile';
import { useStore } from 'effector-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { List } from '@/shared/api/types/list.type';
import { listService } from '@/features/list/_api/list.service';
import { useCachedInfiniteData } from '@/shared/lib/reactQueryAddons/useCachedInfiniteData';
import { transformInfiniteIterableData } from '@/shared/lib/reactQueryAddons/transformInfiniteData';
import { useNewInfiniteData } from '@/shared/lib/reactQueryAddons/useNewInfiniteData';

export const useProfileLists = (profile: Profile) => {
  const lists = useStore($profileLists);

  const result = useInfiniteQuery<IterableResponse<List>, FetchError>({
    queryKey: ['Fetch more profile lists', profile.id],
    queryFn: ({ pageParam }) => listService.getUserLists(profile.id, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
    enabled: false,
    initialData: {
      pageParams: [],
      pages: [
        {
          items: profile.allLists.lists.items,
          nextKey: profile.allLists.lists.nextKey,
        },
      ],
    },
  });

  useCachedInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setProfileLists(content);
    }
  });

  useNewInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setProfileLists(content);
    }
  });

  return {
    result: lists ?? [],
    hasNextPage: result.hasNextPage,
    loadNextPage: result.fetchNextPage,
    isLoadingMore: result.isFetchingNextPage,
    refetch: result.refetch,
  };
};
