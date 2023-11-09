import { useInfiniteQuery } from '@tanstack/react-query';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { ProfileShort } from '@/shared/api/types/profile.type';
import { transformInfiniteIterableData } from '@/shared/utils/reactQueryAddons/transformInfiniteData';
import { useCachedInfiniteData } from '@/shared/utils/reactQueryAddons/useCachedInfiniteData';
import { useNewInfiniteData } from '@/shared/utils/reactQueryAddons/useNewInfiniteData';
import { useStore } from 'effector-react';
import {
  $userFollowed,
  clearUnfollowed,
  setFollowed,
} from '@/entities/user-subscriptions';
import { useAuth } from '@/app';
import { useEffect, useState } from 'react';
import { profileService } from '@/pages/profile/api/profile.service';

export const useFollowed = (userId: number) => {
  const { userId: currentUserID } = useAuth();
  const isOwner = currentUserID === userId;

  const result = useInfiniteQuery<IterableResponse<ProfileShort>, FetchError>({
    queryKey: ['Profile followed', userId],
    queryFn: ({ pageParam }) =>
      profileService.getFollowed(userId, pageParam, 20),
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
    data: isOwner ? myFollowed ?? profilesFetched : profilesFetched,
    isLoading: result.isLoading,
    fetchNextPage: result.fetchNextPage,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
};
