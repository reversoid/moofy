import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FetchError } from '@/shared/api/types/shared';
import { searchProfilesService } from '../api/search-users.service';
import { ProfileShort } from '@/shared/api/types/profile.type';

export const useProfilesSearch = () => {
  const [search, setSearch] = useState('');

  const result = useQuery<
    {profiles: ProfileShort[]} & { search: string },
    FetchError
  >({
    queryKey: ['Search profiles', search ?? ''],
    queryFn: () =>
      searchProfilesService.searchUsers(search).then((r) => ({ profiles: r, search })),
    keepPreviousData: true,
    enabled: false,
  });

  useEffect(() => {
    result.refetch();
  }, [search]);

  const isSearchFinished = result.data?.search === search;

  return {
    loading: result.isFetching,
    search,
    setSearch,
    profiles: result.data?.profiles,
    isSearchFinished,
  };
};
