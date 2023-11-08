import { List } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import { FetchError, IterableResponse } from '@/shared/api/types/shared';
import { useInfiniteQuery } from '@tanstack/react-query';
import { profileService } from '../../api/profile.service';
import { transformInfiniteIterableData } from '@/shared/utils/reactQueryAddons/transformInfiniteData';
import { useState } from 'react';
import { useNewInfiniteData } from '@/shared/utils/reactQueryAddons/useNewInfiniteData';
import { useId } from '../../ui/ProfilePage';
import { useProfileUsername } from './use-profile-username';

export const usePublicReviews = () => {
  const id = useId();
  const username = useProfileUsername(id);
  const [reviewsWithLists, setReviewsWithLists] = useState<
    {
      list: List;
      review: Review;
    }[]
  >();

  const result = useInfiniteQuery<
    IterableResponse<{ list: List; review: Review }>,
    FetchError
  >({
    queryKey: ['Public reviews', id],
    queryFn: ({ pageParam, signal }) =>
      profileService.getPublicUserReviews(id, pageParam, 5, signal),
    getNextPageParam: (lastPage) => lastPage.nextKey ?? undefined,
  });

  useNewInfiniteData(result, () => {
    if (!result.data) return;

    const transformedResponse = transformInfiniteIterableData(result.data);
    setReviewsWithLists(transformedResponse);
  });

  return {
    data: reviewsWithLists,
    isLoading: result.isLoading,
    canLoadMore: result.hasNextPage,
    loadMore: result.fetchNextPage,
    isLoadingMore: result.isFetchingNextPage,
    profileUsername: username,
    profileId: id,
  };
};
