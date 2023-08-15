import { useMutation } from '@tanstack/react-query';
import { setProfileWithoutLists } from '../model';
import { subscriptionsService } from '../subscriptions/api/subscriptions.service';
import { ProfileShort } from '@/shared/api/types/profile.type';
import { removeFollowed } from '@/entities/user-subscriptions';

export const useUnfollow = (profile: ProfileShort) => {
  const mutation = useMutation({
    mutationFn: () => subscriptionsService.unsubscribe(profile.id),

    onSuccess(subscriptionsInfo) {
      removeFollowed({ profileId: profile.id });
      setProfileWithoutLists({
        subscriptionsInfo,
        additionalInfo: { isSubscribed: false },
      });
    },
  });

  return mutation;
};
