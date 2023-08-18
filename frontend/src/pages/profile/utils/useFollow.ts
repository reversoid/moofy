import { useMutation } from '@tanstack/react-query';
import { setProfileWithoutLists } from '../model';
import { subscriptionsService } from '../subscriptions/api/subscriptions.service';
import { addFollowed } from '@/entities/user-subscriptions';
import { ProfileShort } from '@/shared/api/types/profile.type';

export const useFollow = (profile: ProfileShort) => {
  const mutation = useMutation({
    mutationFn: () => subscriptionsService.subscribe(profile.id),

    onSuccess(subscriptionsInfo) {
      addFollowed({
        profile: { ...profile, additionalInfo: { isSubscribed: true } },
      });
      setProfileWithoutLists({
        subscriptionsInfo,
        additionalInfo: { isSubscribed: true },
      });
    },
  });

  return mutation;
};
