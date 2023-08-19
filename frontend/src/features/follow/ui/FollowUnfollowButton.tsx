import { Button, Loading } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
import { useFollow } from '../utils/useFollow';
import { useUnfollow } from '../utils/useUnfollow';
import { ProfileShort } from '@/shared/api/types/profile.type';

export interface SubscribeButtonProps {
  profile: ProfileShort;
}

export const FollowUnfollowButton: FC<SubscribeButtonProps> = ({ profile }) => {
  const [isSubscribed, setIsSubscribed] = useState(
    profile.additionalInfo.isSubscribed,
  );

  useEffect(() => {
    setIsSubscribed(profile.additionalInfo.isSubscribed);
  }, [profile.additionalInfo.isSubscribed]);

  const followMutation = useFollow({
    onSuccess() {
      setIsSubscribed(true);
    },
    profile,
  });
  const unfollowMutation = useUnfollow({
    onSuccess() {
      setIsSubscribed(false);
    },
    profile,
  });

  return (
    <>
      {isSubscribed ? (
        <Button
          color={'gradient'}
          css={{ alignSelf: 'center', '@xsMax': { width: '100%' } }}
          size={'lg'}
          onClick={() => unfollowMutation.mutate(profile.id)}
          disabled={unfollowMutation.isLoading}
          bordered
        >
          {unfollowMutation.isLoading ? (
            <Loading type="points" />
          ) : (
            'Отписаться'
          )}
        </Button>
      ) : (
        <Button
          color={'primary'}
          size={'lg'}
          css={{ alignSelf: 'center', '@xsMax': { width: '100%' } }}
          onClick={() => followMutation.mutate(profile.id)}
          disabled={followMutation.isLoading}
        >
          {followMutation.isLoading ? <Loading type="points" /> : 'Подписаться'}
        </Button>
      )}
    </>
  );
};
