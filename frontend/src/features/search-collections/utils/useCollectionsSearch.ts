import { useQuery } from '@tanstack/react-query';
import { searchCollectionsService } from '../api/search-collections.service';
import { useEffect, useState } from 'react';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { ListWithAdditionalInfo } from '@/shared/api/types/list.type';

export const useCollectionsSearch = () => {
  const [search, setSearch] = useState('');

  const result = useQuery<
    IterableResponse<ListWithAdditionalInfo> & { search: string },
    FetchError
  >({
    queryKey: ['Search collections', search ?? ''],
    queryFn: ({ signal }) =>
      searchCollectionsService
        .searchCollections(search, signal)
        .then((r) => ({ ...r, search })),
    keepPreviousData: true,
  });

  useEffect(() => {
    result.refetch();
  }, [search]);

  return {
    loading: result.isFetching,
    setSearch,
    result: result.data?.items,
  };
};
