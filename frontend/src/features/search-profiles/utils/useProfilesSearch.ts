import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FetchError } from '@/shared/api/types/shared';
import { searchProfilesService } from '../api/search-users.service';
import { ProfileShort } from '@/shared/api/types/profile.type';

export const useProfilesSearch = () => {
  const [search, setSearch] = useState('');

  const result = useQuery<
    { profiles: ProfileShort[] } & { search: string },
    FetchError
  >({
    queryKey: ['Search profiles', search ?? ''],
    queryFn: ({ signal }) =>
      searchProfilesService
        .searchUsers(search, signal)
        .then((r) => ({ profiles: r, search })),
    keepPreviousData: true,
  });

  useEffect(() => {
    result.refetch();
  }, [search]);

  return {
    loading: result.isFetching,
    setSearch,
    result: result.data?.profiles,
  };
};
