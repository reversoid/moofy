import { Profile } from '@/shared/api/types/profile.type';
import {
  $profileFavLists,
  $profileLists,
  setProfileFavLists,
  setProfileLists,
} from '../model';
import { useStore } from 'effector-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { List } from '@/shared/api/types/list.type';
import { listService } from '@/features/list/api/list.service';
import { useCachedInfiniteData } from '@/shared/lib/reactQueryAddons/useCachedInfiniteData';
import { transformInfiniteIterableData } from '@/shared/lib/reactQueryAddons/transformInfiniteData';
import { useNewInfiniteData } from '@/shared/lib/reactQueryAddons/useNewInfiniteData';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';

export const useProfileFavLists = (profile: Profile) => {
  const lists = useStore($profileFavLists);

  const result = useInfiniteQuery<IterableResponse<FavoriteList>, FetchError>({
    queryKey: ['Fetch more profile fav lists', profile.id],
    queryFn: ({ pageParam }) => listService.getFavoritesLists(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
    enabled: false,
    initialData: {
      pageParams: [],
      pages: profile.favLists
        ? [
            {
              items: profile.favLists.lists.items,
              nextKey: profile.favLists.lists.nextKey,
            },
          ]
        : [],
    },
  });

  useCachedInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setProfileFavLists(content);
    }
  });

  useNewInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setProfileFavLists(content);
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
