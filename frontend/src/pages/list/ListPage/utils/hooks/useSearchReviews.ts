import {
  ListWithContentResponse,
  listService,
} from '@/features/list/api/list.service';
import { FetchError } from '@/shared/api/types/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { transformResponse } from '../helpers/transformResponse';

export const useSearchReviews = (listId: number) => {
  const [search, setSearch] = useState('');

  const result = useInfiniteQuery<ListWithContentResponse, FetchError>({
    queryKey: ['Search reviews', search],
    queryFn: ({ pageParam }) =>
      listService.getMyListWithContent(listId, pageParam, search),
    getNextPageParam: (lastPage) => lastPage.reviews.nextKey ?? undefined,
    enabled: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (search) {
      result.refetch();
    }
  }, [search]);


  const data = result.data ? transformResponse(result.data) : undefined

  return {
    loading: result.isFetching,
    searchValue: search,
    setSearch,
    data: data?.reviews,
    loadMore: result.fetchNextPage,
    canLoadMore: result.hasNextPage,
    loadingMore: result.isFetchingNextPage,
  };
};
