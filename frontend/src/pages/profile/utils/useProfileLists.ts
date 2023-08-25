import { Profile } from '@/shared/api/types/profile.type';
import { $profileLists, setProfileLists } from '../model';
import { useStore } from 'effector-react';
import {
  QueryFunction,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { FetchError, Id, IterableResponse } from '@/shared/api/types/shared';
import { List, ListWithAdditionalInfo } from '@/shared/api/types/list.type';
import { listService } from '@/features/list/api/list.service';
import { useCachedInfiniteData } from '@/shared/lib/reactQueryAddons/useCachedInfiniteData';
import { transformInfiniteIterableData } from '@/shared/lib/reactQueryAddons/transformInfiniteData';
import { useNewInfiniteData } from '@/shared/lib/reactQueryAddons/useNewInfiniteData';
import { useAuth } from '@/app';

const useFnToFetch = (
  profileId: Id,
):
  | QueryFunction<IterableResponse<ListWithAdditionalInfo>, QueryKey, any>
  | undefined => {
  const { userId } = useAuth();
  const userIsOwner = userId === profileId;

  if (userIsOwner) {
    return ({ pageParam }) => listService.getMyLists(pageParam);
  }

  return ({ pageParam }) => listService.getUserLists(profileId, pageParam);
};

export const useProfileLists = (profile: Profile) => {
  const lists = useStore($profileLists);
  const fnToFetch = useFnToFetch(profile.id);

  const result = useInfiniteQuery<
    IterableResponse<ListWithAdditionalInfo>,
    FetchError
  >({
    queryKey: ['Fetch more profile lists', profile.id],
    queryFn: fnToFetch,
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
    enabled: false,
    initialData: {
      pageParams: [],
      pages: [
        {
          items: profile.allLists.lists.items.map((i) => ({ list: i })),
          nextKey: profile.allLists.lists.nextKey,
        },
      ],
    },
  });

  useCachedInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setProfileLists(content.map((c) => c.list));
    }
  });

  useNewInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setProfileLists(content.map((c) => c.list));
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
