import { useQuery } from '@tanstack/react-query';
import { searchCollectionsService } from '../api/search-collections.service';
import { useEffect, useState } from 'react';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { List, ListWithAdditionalInfo } from '@/shared/api/types/list.type';

export const useCollectionsSearch = () => {
  const [search, setSearch] = useState('');

  const result = useQuery<
    IterableResponse<ListWithAdditionalInfo> & { search: string },
    FetchError
  >({
    queryKey: ['Search collections', search ?? ''],
    queryFn: () =>
      searchCollectionsService
        .searchCollections(search)
        .then((r) => ({ ...r, search })),
    keepPreviousData: true,
  });

  useEffect(() => {
    result.refetch();
  }, [search]);

  const isSearchFinished = result.data?.search === search;

  return {
    loading: result.isFetching,
    search,
    setSearch,
    result: result.data?.items,
    isSearchFinished,
  };
};
