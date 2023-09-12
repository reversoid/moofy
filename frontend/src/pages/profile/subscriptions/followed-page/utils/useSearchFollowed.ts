import { ProfileShort } from '@/shared/api/types/profile.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { subscriptionsService } from '../../api/subscriptions.service';
import { transformInfiniteIterableData } from '@/shared/utils/reactQueryAddons/transformInfiniteData';

export const useSearchFollowed = (userId: number) => {
  const [search, setSearch] = useState('');

  const result = useInfiniteQuery<
    IterableResponse<ProfileShort> & { search: string },
    FetchError
  >({
    queryKey: ['Search followed', search],
    queryFn: ({ pageParam }) =>
      subscriptionsService
        .getFollowed(userId, pageParam, 20, search)
        .then((r) => ({ ...r, search })),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
    enabled: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (search) {
      result.refetch();
    } else {
      result.remove();
    }
  }, [search]);

  const data = result.data
    ? transformInfiniteIterableData(result.data)
    : undefined;

  const isSearchFinished = result.data?.pages.at(-1)?.search === search;

  return {
    loading: result.isFetching,
    searchValue: search,
    setSearch,
    data,
    isSearchFinished,
  };
};
