import { profileService } from '@/pages/profile/api/profile.service';
import { ProfileShort } from '@/shared/api/types/profile.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useSearchFollowed = (userId: number) => {
  const [search, setSearch] = useState('');

  const result = useQuery<
    IterableResponse<ProfileShort> & { search: string },
    FetchError
  >({
    queryKey: ['Search followed', userId, search],
    queryFn: ({ pageParam, signal }) =>
      profileService
        .getFollowed(userId, pageParam, 20, search, signal)
        .then((r) => ({ ...r, search })),
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

  return {
    loading: result.isFetching,
    searchValue: search,
    setSearch,
    data: result.data?.items,
  };
};
