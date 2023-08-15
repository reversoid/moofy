import { useInfiniteQuery } from '@tanstack/react-query';
import { subscriptionsService } from '../../api/subscriptions.service';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { ProfileShort } from '@/shared/api/types/profile.type';
import { transformInfiniteIterableData } from '@/shared/lib/reactQueryAddons/transformInfiniteData';
import { useCachedInfiniteData } from '@/shared/lib/reactQueryAddons/useCachedInfiniteData';
import { useState } from 'react';
import { useNewInfiniteData } from '@/shared/lib/reactQueryAddons/useNewInfiniteData';

export const useFollowed = (userId: number) => {
  const result = useInfiniteQuery<IterableResponse<ProfileShort>, FetchError>({
    queryKey: ['Profile followed', userId],
    queryFn: ({ pageParam }) =>
      subscriptionsService.getFollowed(userId, pageParam, 20),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
  });

  const [profiles, setProfiles] = useState<ProfileShort[]>()

  useCachedInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setProfiles(content);
    }
  });

  useNewInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setProfiles(content);
    }
  });

  return {
    data: profiles,
    isLoading: result.isLoading,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
};
