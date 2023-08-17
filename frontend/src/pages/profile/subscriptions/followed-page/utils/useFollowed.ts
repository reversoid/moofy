import { useInfiniteQuery } from '@tanstack/react-query';
import { subscriptionsService } from '../../api/subscriptions.service';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { ProfileShort } from '@/shared/api/types/profile.type';
import { transformInfiniteIterableData } from '@/shared/lib/reactQueryAddons/transformInfiniteData';
import { useCachedInfiniteData } from '@/shared/lib/reactQueryAddons/useCachedInfiniteData';
import { useNewInfiniteData } from '@/shared/lib/reactQueryAddons/useNewInfiniteData';
import { useStore } from 'effector-react';
import {
  $userFollowed,
  clearUnfollowed,
  setFollowed,
} from '@/entities/user-subscriptions';
import { useAuth } from '@/app';
import { useEffect, useState } from 'react';

export const useFollowed = (userId: number) => {
  const { userId: currentUserID } = useAuth();
  const isOwner = currentUserID === userId;

  const result = useInfiniteQuery<IterableResponse<ProfileShort>, FetchError>({
    queryKey: ['Profile followed', userId],
    queryFn: ({ pageParam }) =>
      subscriptionsService.getFollowed(userId, pageParam, 20),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
  });

  const myFollowed = useStore($userFollowed);
  const [profilesFetched, setProfilesFetched] = useState<ProfileShort[]>();

  useCachedInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setProfilesFetched(content);

      if (isOwner && !myFollowed) {
        setFollowed({ profiles: content });
      }
    }
  });

  useNewInfiniteData(result, () => {
    if (result.data) {
      const content = transformInfiniteIterableData(result.data);
      setProfilesFetched(content);

      if (isOwner) {
        setFollowed({ profiles: content });
      }
    }
  });

  useEffect(() => {
    return () => {
      clearUnfollowed();
    };
  }, []);

  return {
    data: isOwner ? myFollowed ?? undefined : profilesFetched,
    isLoading: result.isLoading,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
};
