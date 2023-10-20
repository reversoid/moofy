import { listService } from '@/features/list/api/list.service';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { Profile } from '@/shared/api/types/profile.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { transformInfiniteIterableData } from '@/shared/utils/reactQueryAddons/transformInfiniteData';
import { useCachedInfiniteData } from '@/shared/utils/reactQueryAddons/useCachedInfiniteData';
import { useNewInfiniteData } from '@/shared/utils/reactQueryAddons/useNewInfiniteData';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useStore } from 'effector-react';
import { $profileFavLists, setProfileFavLists } from '../model';

export const useProfileFavLists = (profile: Profile) => {
  const lists = useStore($profileFavLists);

  const result = useInfiniteQuery<IterableResponse<FavoriteList>, FetchError>({
    queryKey: ['Fetch more profile fav lists', profile.id],
    queryFn: ({ pageParam }) => listService.getFavoritesLists(pageParam),
    getNextPageParam: (lastPage) => lastPage?.nextKey ?? undefined,
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
      if (!lists) {
        setProfileFavLists(content);
      }
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
