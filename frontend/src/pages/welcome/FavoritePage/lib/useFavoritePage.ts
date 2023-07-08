import { listService } from '@/features/list/_api/list.service';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { List } from '@/shared/api/types/list.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { transformResponse } from './transformResponse';
import {
  $favoriteListsMap,
  $userFavLists,
  setFavorites,
} from '@/entities/user-fav-lists';
import { useStore } from 'effector-react';

export const useFavoritePage = () => {
  const favoriteLists = useStore($userFavLists);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchedAfterMount,
    isFetchingNextPage,
  } = useInfiniteQuery<IterableResponse<FavoriteList>, FetchError>({
    queryKey: ['Favorite collections page'],
    queryFn: ({ pageParam }) => listService.getFavoritesLists(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
  });

  useEffect(() => {
    // TODO maybe create hook for doubling this logic?
    const isOutdated = !data || isFetchingNextPage || !isFetchedAfterMount;
    if (isOutdated) {
      return;
    }

    const content = transformResponse(data);
    setFavorites(content);
  }, [isFetchedAfterMount, isFetchingNextPage]);

  return {
    data: favoriteLists,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  }
};
